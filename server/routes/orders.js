import express from 'express';
import db from '../db/database.js';
import supabase from '../db/supabaseClient.js';

const router = express.Router();
const FREE_SHIPPING_THRESHOLD = 25.00;
const SHIPPING_FEE = 3.50;

// POST /api/v1/orders - Create Order (Supabase or SQLite)
router.post('/', async (req, res) => {
  const { customerName, phone, address, items, paymentMethod } = req.body;

  if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: "Todos los campos de entrega y al menos un producto son requeridos." }
    });
  }

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;

  // Build WhatsApp text
  let message = `🛒 *NUEVO PEDIDO #${orderId} - FRESCURA EN MOVIMIENTO*\n\n`;
  message += `👤 *Cliente:* ${customerName}\n📞 *Teléfono:* ${phone}\n📍 *Dirección:* ${address}\n\n`;
  message += `📋 *Detalle de Productos:*\n`;

  items.forEach((item, idx) => {
    message += `${idx + 1}. ${item.name} x${item.quantity} -> $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  message += `\n💰 *Subtotal:* $${subtotal.toFixed(2)}`;
  message += `\n🚚 *Envío:* ${shippingFee === 0 ? 'GRATIS' : '$' + shippingFee.toFixed(2)}`;
  message += `\n✅ *TOTAL A PAGAR:* $${total.toFixed(2)}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert([{
        id: orderId,
        customer_name: customerName,
        phone,
        address,
        subtotal,
        shipping_fee: shippingFee,
        total,
        status: 'PENDING',
        payment_method: paymentMethod || 'CASH_ON_DELIVERY',
        items_json: items
      }]).select().single();

      if (!error && data) {
        return res.status(201).json({
          data: {
            orderId,
            customerName,
            subtotal,
            shippingFee,
            total,
            status: 'PENDING',
            whatsappUrl,
            source: 'supabase'
          }
        });
      }
    } catch (err) {
      console.warn('⚠️ Supabase order creation failed, creating in SQLite:', err.message);
    }
  }

  // SQLite Fallback
  const itemsJsonStr = JSON.stringify(items);
  const stmt = db.prepare(`
    INSERT INTO orders (id, customer_name, phone, address, subtotal, shipping_fee, total, status, payment_method, items_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
  `);

  stmt.run(orderId, customerName, phone, address, subtotal, shippingFee, total, paymentMethod || 'CASH_ON_DELIVERY', itemsJsonStr, function(err) {
    if (err) {
      return res.status(500).json({ error: { code: "DB_ERROR", message: err.message } });
    }

    res.status(201).json({
      data: {
        orderId,
        customerName,
        subtotal,
        shippingFee,
        total,
        status: 'PENDING',
        whatsappUrl,
        source: 'sqlite'
      }
    });
  });
});

// GET /api/v1/orders - Retrieve list of orders
router.get('/', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const formatted = data.map(o => ({
          ...o,
          items: Array.isArray(o.items_json) ? o.items_json : JSON.parse(o.items_json || '[]')
        }));
        return res.json({ data: formatted, count: formatted.length, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase orders fetch failed, reading from SQLite:', err.message);
    }
  }

  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: { code: "DB_ERROR", message: err.message } });
    const formattedRows = rows.map(r => ({
      ...r,
      items: JSON.parse(r.items_json || '[]')
    }));
    res.json({ data: formattedRows, count: formattedRows.length, source: 'sqlite' });
  });
});

// PATCH /api/v1/orders/:id/status - Update Order Status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: { code: "INVALID_STATUS", message: "Estado no válido." } });
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.id).select().single();
      if (!error && data) {
        return res.json({ data: { orderId: req.params.id, status }, source: 'supabase' });
      }
    } catch (err) {
      // Fallback to SQLite
    }
  }

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: { code: "DB_ERROR", message: err.message } });
    res.json({ data: { orderId: req.params.id, status }, source: 'sqlite' });
  });
});

export default router;
