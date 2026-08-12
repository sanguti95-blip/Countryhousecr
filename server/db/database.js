import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'verdant_harvest.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ SQLite Database connected at:', dbPath);
  }
});

// Initialize Schema
db.serialize(() => {
  // 1. Categories Table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  // 2. Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      unit TEXT NOT NULL,
      badge TEXT,
      image TEXT NOT NULL,
      recipe TEXT,
      stock_kg REAL DEFAULT 100
    )
  `);

  // 3. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'CLIENT',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Orders Table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping_fee REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'PENDING',
      payment_method TEXT DEFAULT 'CASH_ON_DELIVERY',
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed Default Products if Table is Empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row && row.count === 0) {
      console.log('🌱 Seeding default products into SQLite database...');
      const seedProducts = [
        ['prod-1', 'Tomates Cherry Orgánicos', 'verduras', 4.50, 'kg', 'Cosecha de Hoy', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADZS8vjaWNvP9A2Ct21Bt6TzoxT-mh5vLLxjbefvj3YvMAEkezLWMIV32gWghlealUEE5YFQZoCHpQ9pRdol8_LDNGBkd7oUdozCBNQgks3Hlkji56G30hw_1NANH820P-w3A257OUNzNw6b7x_-OYn4j-4VXZyR29HDhwqrFWXFbg0xWL0BSsZKJyhw0f2WOvjkTtKImll54Z3BbPm7Z-tAOIx2j3eSAuhrk9CS5o_nstJD3eaUcE', 'Ensalada César con Cherry'],
        ['prod-2', 'Zanahorias Orgánicas de Campo', 'organicos', 2.80, 'kg', '100% Orgánico', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbJGNHqnQYGLb734S4nV6yTvoE6nA39wDr19Tmx0fGWu5yJIEzr9Y6p3vcL-MMyJumVarJgkTYVvjQkANJOGyKUOSYFI1m9X4_oBSDWrr1mUNXhyfDQVnZ8Ul3mGQ0qATwLAVAEcF8Zu5sQVs37WeJPwsVpKsGEEsRIMPhMOTMarYzTQQA9fEJeC2VlcaIch-1Yvz-BD9EXumf7uiHSLvCKCvP76NNVOqSfze5pp3v0DK4lpyQPLH0', 'Crema de Zanahoria y Jengibre'],
        ['prod-3', 'Aguacate Hass Premium', 'frutas', 6.20, 'kg', 'Punto Óptimo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCteltVoG8moCPrIg7F3-Ea0zxrhxyxUbgow1t6tp-ibaobokh-8zegA7hFMXmkbBxU19ml-tX-ZuqgAvTpdyvll0UtPqWxsYpibOaNzgflzMj1rBsHhA0f-I-lkEJx6RneWw1otZvnVjmchSDytNeGhjcmBbWFPpkEv8GEroZqPDsCOPJHdKzuEEDik3EQFI4SQRw2Le1BfV4OheLqeAqNFBMz9xGtiGq525fLb2uolo0mMBiDKlYg', 'Tostada de Aguacate y Pepino'],
        ['prod-4', 'Caja Canasta de Temporada (Mixta)', 'packs', 18.50, 'caja', 'Más Vendido', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBONh-DN6pg8nWZvFsckLS2YhFkcPIVM63KaqR5ENld0_8B5yIeBAmW57O5DrRLapYohwK1LNf3lWPzEyKosagGVCXEfrIQDYEbCw_aQmEzaDG2Qp0ODuhyWq9gYi4nXwnWQpZnagGF3xt30qE2LHQLnaPGJS_1Un7Y9GOz162T9ZVXYrccmjUFwMOEbNrQLlzYRCUjI4cXQRZBJIOqzDCIeKqs5h9zC5vzpQ2yjKxKSZJwhbEts47o', 'Sopa Huerto Familiar'],
        ['prod-5', 'Selección de Frutas de Estación', 'frutas', 5.90, 'kg', 'Sabor Dulce', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2bPmYg5pp038WVVYEhVyf4iqjqRXq9PY1NI5WW-GFche_GNLOJvgmDk8JNT9q_E9u7P2TH9I9_K0NI6NiNUd9EK7oErr1GCh0PU0_CxNPXYEk1zqfCA2Q_vDsTYnoSfUDrsktM9cwG55qcCNFy0jy9pxlXarZHKDfaVa_8LTQ_iNgfl2JWKpsWAZutXxzlpAWf6B_vTmFAM_shzdOX452WXhfLOxrbsu4MigRcC29nMVPBmE2_96F', 'Bowl de Frutas del Campo'],
        ['prod-6', 'Pepino Cohombro Crujiente', 'verduras', 2.10, 'kg', 'Fresco', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqAYxM7mJdSjF7Q59eMnsS-ZJ5UzS5horkzSMracClJ2myLyI2k4EG6xEEGJfNx2h2tv-UwmX26BGiz5vTeuW4ZJwd4p9wjZXQZ7pNV0JRaror_o-v4yaSqwMDX7imS_mOwmWaLShcYzvQG96_9t3MFseHyx4AlIhaq41ijKV9moNbvzN1pGEcJYzA3eCIqoADWoYoOWTyjBwf6RMo1qqAqOePaZ1iBQ-1XUuhGABo1sMaiNROkrNU', 'Ensalada Griega Fresca'],
        ['prod-7', 'Raíces y Tubérculos Orgánicos', 'organicos', 3.40, 'kg', 'Del Agricultor', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7llXWznsocdOkHCFVfohLcXK0CHHwq7N2tfCzu35JWvFxaVgjj5gXYoEPcAJ1Si1n-3V0LuxFZtq1I6TXazd2HmWHcfu91TYT4j4VGetr7gyiwO0J9VNc4srsgyOyY48cypnk7V6fWALv0bWoZQJySKKg5fQKhZ7IlNeDHrABaGqpsMlfd7okthwnVaQxAoJKS7oOvJ_4tWvlshOMkkK3YLCL_VALCD66Wwxqy5emrM4AqdWd_Fb', 'Salteado Campestre'],
        ['prod-8', 'Pack Ensalada Mediterránea Completa', 'packs', 12.90, 'pack', 'Receta Incluida', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk_vgc_LPI8hw-RTyLL9DJ3SQ1N2iA5PEBT4XmBWv1s_tNjvkUbb0dwuNHSBOJuya3LKbfe7xtG43ggcPmaHrdNxNcjkHjoZ9d52wSJmlW3hgjD9603T7g-qmxILRbG0s0ZpfMy6b_pgaNck5kQe5HbZPStcnrfAW4lGJrNYuztn_lvu6PgLvmec3Ft7i03G7Y1QWbKUEyjsK6yeL-lWiKKZKFSR2Hp63Z9r26Kd9c7FDjSW7Obntp', 'Ensalada Mediterránea Vibrante']
      ];

      const stmt = db.prepare("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, 100)");
      seedProducts.forEach(prod => stmt.run(prod));
      stmt.finalize();
    }
  });
});

export default db;
