import express from 'express';
import db from '../db/database.js';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

// GET /api/v1/products - List products (Supabase or SQLite)
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  // 1. Try Supabase Cloud DB if configured
  if (supabase) {
    try {
      let query = supabase.from('products').select('*');

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,recipe.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ data, count: data.length, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase query failed, falling back to SQLite:', err.message);
    }
  }

  // 2. Fallback to Local SQLite DB
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (category && category !== 'all') {
    query += " AND category = ?";
    params.push(category);
  }

  if (search) {
    query += " AND (name LIKE ? OR recipe LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: { code: "DB_ERROR", message: err.message } });
    }
    res.json({ data: rows, count: rows.length, source: 'sqlite' });
  });
});

// GET /api/v1/products/:id - Get single product
router.get('/:id', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
      if (!error && data) {
        return res.json({ data, source: 'supabase' });
      }
    } catch (err) {
      // Fallback
    }
  }

  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: { code: "DB_ERROR", message: err.message } });
    if (!row) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Producto no encontrado" } });
    res.json({ data: row, source: 'sqlite' });
  });
});

// POST /api/v1/products - Add product (Supabase or SQLite)
router.post('/', async (req, res) => {
  const { name, category, price, unit, badge, image, recipe, stock_kg } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Nombre, categoría y precio son requeridos." } });
  }

  const id = `prod-${Date.now()}`;
  const newProduct = {
    id,
    name,
    category,
    price: Number(price),
    unit: unit || 'kg',
    badge: badge || 'Cosecha de Hoy',
    image: image || '',
    recipe: recipe || '',
    stock_kg: Number(stock_kg || 100)
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (!error && data) {
        return res.status(201).json({ data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase insert failed, inserting into SQLite:', err.message);
    }
  }

  const stmt = db.prepare(`
    INSERT INTO products (id, name, category, price, unit, badge, image, recipe, stock_kg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, name, category, price, unit || 'kg', badge || 'Cosecha de Hoy', image || '', recipe || '', stock_kg || 100, function(err) {
    if (err) return res.status(500).json({ error: { code: "DB_ERROR", message: err.message } });
    res.status(201).json({ data: newProduct, source: 'sqlite' });
  });
});

export default router;
