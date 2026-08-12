/**
 * Country House - Organic Farm & Delivery
 * Interactive Client JavaScript (REST API + Supabase Integration)
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

// 1. Data Store: Dynamic Products & Fallback Catalog
let PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Tomates Cherry Orgánicos',
    category: 'verduras',
    price: 4.50,
    unit: 'kg',
    badge: 'Cosecha de Hoy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADZS8vjaWNvP9A2Ct21Bt6TzoxT-mh5vLLxjbefvj3YvMAEkezLWMIV32gWghlealUEE5YFQZoCHpQ9pRdol8_LDNGBkd7oUdozCBNQgks3Hlkji56G30hw_1NANH820P-w3A257OUNzNw6b7x_-OYn4j-4VXZyR29HDhwqrFWXFbg0xWL0BSsZKJyhw0f2WOvjkTtKImll54Z3BbPm7Z-tAOIx2j3eSAuhrk9CS5o_nstJD3eaUcE',
    recipe: 'Ensalada César con Cherry'
  },
  {
    id: 'prod-2',
    name: 'Zanahorias Orgánicas de Campo',
    category: 'organicos',
    price: 2.80,
    unit: 'kg',
    badge: '100% Orgánico',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbJGNHqnQYGLb734S4nV6yTvoE6nA39wDr19Tmx0fGWu5yJIEzr9Y6p3vcL-MMyJumVarJgkTYVvjQkANJOGyKUOSYFI1m9X4_oBSDWrr1mUNXhyfDQVnZ8Ul3mGQ0qATwLAVAEcF8Zu5sQVs37WeJPwsVpKsGEEsRIMPhMOTMarYzTQQA9fEJeC2VlcaIch-1Yvz-BD9EXumf7uiHSLvCKCvP76NNVOqSfze5pp3v0DK4lpyQPLH0',
    recipe: 'Crema de Zanahoria y Jengibre'
  },
  {
    id: 'prod-3',
    name: 'Aguacate Hass Premium',
    category: 'frutas',
    price: 6.20,
    unit: 'kg',
    badge: 'Punto Óptimo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCteltVoG8moCPrIg7F3-Ea0zxrhxyxUbgow1t6tp-ibaobokh-8zegA7hFMXmkbBxU19ml-tX-ZuqgAvTpdyvll0UtPqWxsYpibOaNzgflzMj1rBsHhA0f-I-lkEJx6RneWw1otZvnVjmchSDytNeGhjcmBbWFPpkEv8GEroZqPDsCOPJHdKzuEEDik3EQFI4SQRw2Le1BfV4OheLqeAqNFBMz9xGtiGq525fLb2uolo0mMBiDKlYg',
    recipe: 'Tostada de Aguacate y Pepino'
  },
  {
    id: 'prod-4',
    name: 'Caja Canasta de Temporada (Mixta)',
    category: 'packs',
    price: 18.50,
    unit: 'caja',
    badge: 'Más Vendido',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBONh-DN6pg8nWZvFsckLS2YhFkcPIVM63KaqR5ENld0_8B5yIeBAmW57O5DrRLapYohwK1LNf3lWPzEyKosagGVCXEfrIQDYEbCw_aQmEzaDG2Qp0ODuhyWq9gYi4nXwnWQpZnagGF3xt30qE2LHQLnaPGJS_1Un7Y9GOz162T9ZVXYrccmjUFwMOEbNrQLlzYRCUjI4cXQRZBJIOqzDCIeKqs5h9zC5vzpQ2yjKxKSZJwhbEts47o',
    recipe: 'Sopa Huerto Familiar'
  },
  {
    id: 'prod-5',
    name: 'Selección de Frutas de Estación',
    category: 'frutas',
    price: 5.90,
    unit: 'kg',
    badge: 'Sabor Dulce',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2bPmYg5pp038WVVYEhVyf4iqjqRXq9PY1NI5WW-GFche_GNLOJvgmDk8JNT9q_E9u7P2TH9I9_K0NI6NiNUd9EK7oErr1GCh0PU0_CxNPXYEk1zqfCA2Q_vDsTYnoSfUDrsktM9cwG55qcCNFy0jy9pxlXarZHKDfaVa_8LTQ_iNgfl2JWKpsWAZutXxzlpAWf6B_vTmFAM_shzdOX452WXhfLOxrbsu4MigRcC29nMVPBmE2_96F',
    recipe: 'Bowl de Frutas del Campo'
  },
  {
    id: 'prod-6',
    name: 'Pepino Cohombro Crujiente',
    category: 'verduras',
    price: 2.10,
    unit: 'kg',
    badge: 'Fresco',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqAYxM7mJdSjF7Q59eMnsS-ZJ5UzS5horkzSMracClJ2myLyI2k4EG6xEEGJfNx2h2tv-UwmX26BGiz5vTeuW4ZJwd4p9wjZXQZ7pNV0JRaror_o-v4yaSqwMDX7imS_mOwmWaLShcYzvQG96_9t3MFseHyx4AlIhaq41ijKV9moNbvzN1pGEcJYzA3eCIqoADWoYoOWTyjBwf6RMo1qqAqOePaZ1iBQ-1XUuhGABo1sMaiNROkrNU',
    recipe: 'Ensalada Griega Fresca'
  },
  {
    id: 'prod-7',
    name: 'Raíces y Tubérculos Orgánicos',
    category: 'organicos',
    price: 3.40,
    unit: 'kg',
    badge: 'Del Agricultor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7llXWznsocdOkHCFVfohLcXK0CHHwq7N2tfCzu35JWvFxaVgjj5gXYoEPcAJ1Si1n-3V0LuxFZtq1I6TXazd2HmWHcfu91TYT4j4VGetr7gyiwO0J9VNc4srsgyOyY48cypnk7V6fWALv0bWoZQJySKKg5fQKhZ7IlNeDHrABaGqpsMlfd7okthwnVaQxAoJKS7oOvJ_4tWvlshOMkkK3YLCL_VALCD66Wwxqy5emrM4AqdWd_Fb',
    recipe: 'Salteado Campestre'
  },
  {
    id: 'prod-8',
    name: 'Pack Ensalada Mediterránea Completa',
    category: 'packs',
    price: 12.90,
    unit: 'pack',
    badge: 'Receta Incluida',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk_vgc_LPI8hw-RTyLL9DJ3SQ1N2iA5PEBT4XmBWv1s_tNjvkUbb0dwuNHSBOJuya3LKbfe7xtG43ggcPmaHrdNxNcjkHjoZ9d52wSJmlW3hgjD9603T7g-qmxILRbG0s0ZpfMy6b_pgaNck5kQe5HbZPStcnrfAW4lGJrNYuztn_lvu6PgLvmec3Ft7i03G7Y1QWbKUEyjsK6yeL-lWiKKZKFSR2Hp63Z9r26Kd9c7FDjSW7Obntp',
    recipe: 'Ensalada Mediterránea Vibrante'
  }
];

// 2. Application State
let cart = [];
let activeCategory = 'all';
let searchQuery = '';
const FREE_SHIPPING_THRESHOLD = 25.00;
const SHIPPING_FEE = 3.50;

// 3. DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  fetchProductsFromAPI();
  setupEventListeners();
  updateCartUI();
});

// Fetch Products from REST API
async function fetchProductsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        PRODUCTS = json.data;
        console.log('📡 Dynamic Products loaded from REST API:', PRODUCTS.length);
      }
    }
  } catch (err) {
    console.warn('⚠️ REST API offline. Using fallback produce dataset.');
  } finally {
    renderProducts();
  }
}

// 4. Render Products Grid
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = (activeCategory === 'all') || (product.category === activeCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.recipe && product.recipe.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <span class="material-symbols-outlined text-5xl text-outline mb-3">search_off</span>
        <h3 class="text-headline-md font-bold text-on-surface">No se encontraron productos</h3>
        <p class="text-body-md text-on-surface-variant">Prueba con otra palabra clave o cambia de categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(prod => `
    <div class="bg-surface rounded-2xl shadow-sm border border-outline-variant overflow-hidden product-card flex flex-col justify-between" data-id="${prod.id}">
      <div>
        <div class="relative h-56 overflow-hidden bg-surface-container">
          <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover" loading="lazy" />
          <span class="absolute top-3 left-3 bg-primary/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ${prod.badge}
          </span>
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-body-lg font-bold text-on-surface leading-snug">${prod.name}</h3>
            <span class="text-primary font-bold text-lg whitespace-nowrap ml-2">$${Number(prod.price).toFixed(2)} / ${prod.unit}</span>
          </div>
          ${prod.recipe ? `
          <button onclick="openRecipeModal('${prod.recipe}', '${prod.name}')" class="text-secondary hover:text-secondary-container text-sm font-semibold mb-4 inline-flex items-center gap-1 underline transition-colors">
            <span class="material-symbols-outlined text-[16px]">menu_book</span> ${prod.recipe}
          </button>
          ` : ''}
        </div>
      </div>
      <div class="px-5 pb-5">
        <button onclick="addToCart('${prod.id}')" class="w-full bg-primary hover:bg-primary-container text-white font-bold py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-95">
          <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          Añadir al Carrito
        </button>
      </div>
    </div>
  `).join('');
}

// 5. Event Listeners Setup
function setupEventListeners() {
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active', 'bg-primary', 'text-white'));
      tabs.forEach(t => t.classList.add('bg-surface-container', 'text-on-surface-variant'));
      
      tab.classList.remove('bg-surface-container', 'text-on-surface-variant');
      tab.classList.add('active', 'bg-primary', 'text-white');
      
      activeCategory = tab.getAttribute('data-category');
      renderProducts();
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartBackdrop = document.getElementById('cart-backdrop');

  if (cartBtn) cartBtn.addEventListener('click', toggleCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCartDrawer);
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) toggleCartDrawer();
    });
  }
}

// 6. Cart Management Functions
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  updateCartUI();
  showToast(`¡${product.name} añadido al carrito!`);
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const countBadge = document.getElementById('cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');
  const progressBar = document.getElementById('free-shipping-bar');
  const progressText = document.getElementById('free-shipping-text');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countBadge) {
    countBadge.textContent = totalItems;
    countBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = isFreeShipping ? '¡GRATIS!' : `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  if (progressBar && progressText) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      progressBar.style.width = '100%';
      progressText.textContent = '¡Felicidades! Tienes envío GRATIS 🎉';
    } else {
      const percentage = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `Añade $${remaining.toFixed(2)} más para envío GRATIS`;
    }
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-16 text-on-surface-variant">
        <span class="material-symbols-outlined text-6xl text-outline/50 mb-3">shopping_basket</span>
        <p class="text-body-lg font-semibold">Tu carrito está vacío</p>
        <p class="text-body-md text-sm mt-1">Explora nuestras verduras frescas y añádelas aquí.</p>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="flex items-center gap-4 py-4 border-b border-outline-variant/50">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl bg-surface-container" />
      <div class="flex-1">
        <h4 class="font-bold text-on-surface text-sm leading-tight">${item.name}</h4>
        <span class="text-xs text-on-surface-variant">$${Number(item.price).toFixed(2)} / ${item.unit}</span>
        <div class="flex items-center gap-3 mt-2">
          <div class="flex items-center border border-outline-variant rounded-full bg-surface-container px-2 py-0.5">
            <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-on-surface font-bold hover:text-primary cursor-pointer">-</button>
            <span class="px-2 text-sm font-bold text-on-surface">${item.quantity}</span>
            <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-on-surface font-bold hover:text-primary cursor-pointer">+</button>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="text-xs text-tertiary hover:underline flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[14px]">delete</span> Eliminar
          </button>
        </div>
      </div>
      <div class="text-right">
        <span class="font-bold text-primary text-sm">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

function toggleCartDrawer() {
  const backdrop = document.getElementById('cart-backdrop');
  if (backdrop) backdrop.classList.toggle('active');
}

// 7. Add Entire Recipe Ingredients to Cart
function addRecipeBundle(recipeName) {
  if (recipeName === 'Ensalada Mediterránea Vibrante') {
    addToCart('prod-8', 1);
    showToast('¡Ingredientes de Ensalada Mediterránea añadidos!');
  }
}

// 8. Custom Box Builder Add
function addCustomBoxToCart() {
  const boxSizeSelect = document.getElementById('box-size');
  if (!boxSizeSelect) return;

  const boxType = boxSizeSelect.value;
  let price = 15.00;
  let name = 'Canasta Orgánica Individual';

  if (boxType === 'mediana') {
    price = 24.00;
    name = 'Canasta Orgánica Mediana';
  } else if (boxType === 'familiar') {
    price = 35.00;
    name = 'Canasta Orgánica Familiar';
  }

  const customItem = {
    id: `custom-box-${Date.now()}`,
    name: `${name} (Personalizada)`,
    price: price,
    unit: 'caja',
    badge: 'Custom',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBONh-DN6pg8nWZvFsckLS2YhFkcPIVM63KaqR5ENld0_8B5yIeBAmW57O5DrRLapYohwK1LNf3lWPzEyKosagGVCXEfrIQDYEbCw_aQmEzaDG2Qp0ODuhyWq9gYi4nXwnWQpZnagGF3xt30qE2LHQLnaPGJS_1Un7Y9GOz162T9ZVXYrccmjUFwMOEbNrQLlzYRCUjI4cXQRZBJIOqzDCIeKqs5h9zC5vzpQ2yjKxKSZJwhbEts47o',
    quantity: 1
  };

  cart.push(customItem);
  updateCartUI();
  toggleCartDrawer();
  showToast(`¡${name} añadida a tu pedido!`);
}

// 9. Checkout WhatsApp & REST API Order Generator
async function processCheckoutWhatsApp() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Añade productos antes de realizar el pedido.');
    return;
  }

  const customerName = prompt('Ingresa tu nombre completo:', 'Cliente Country House');
  if (!customerName) return;

  const address = prompt('Ingresa la dirección de entrega:', 'Calle Finca Orgánica #123');
  if (!address) return;

  const phone = prompt('Ingresa tu número de teléfono:', '+57 300 000 0000');
  if (!phone) return;

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        phone,
        address,
        items: cart,
        paymentMethod: 'CASH_ON_DELIVERY'
      })
    });

    if (response.ok) {
      const json = await response.json();
      cart = [];
      updateCartUI();
      toggleCartDrawer();
      showToast(`¡Pedido #${json.data.orderId} registrado con éxito!`);
      
      if (json.data.whatsappUrl) {
        window.open(json.data.whatsappUrl, '_blank');
      }
    } else {
      throw new Error('Error guardando pedido en servidor');
    }
  } catch (err) {
    console.warn('⚠️ Fallback WhatsApp direct opening');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    let message = `🛒 *NUEVO PEDIDO - COUNTRY HOUSE*\n\n`;
    message += `👤 *Cliente:* ${customerName}\n📞 *Teléfono:* ${phone}\n📍 *Dirección:* ${address}\n\n`;
    message += `📋 *Detalle del Pedido:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} -> $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💰 *Subtotal:* $${subtotal.toFixed(2)}`;
    message += `\n🚚 *Envío:* ${shipping === 0 ? 'GRATIS' : '$' + shipping.toFixed(2)}`;
    message += `\n✅ *TOTAL A PAGAR:* $${total.toFixed(2)}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    cart = [];
    updateCartUI();
    toggleCartDrawer();
  }
}

// 10. Recipe Modal
function openRecipeModal(recipeTitle, productName) {
  alert(`📖 Receta: ${recipeTitle}\n\nRecomendada especialmente para preparar con ${productName}. ¡Incluye este ingrediente fresco en tu pedido Country House y disfruta del auténtico sabor de campo!`);
}

// 11. Toast Notifications
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
