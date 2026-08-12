-- ==========================================================================
-- Frescura en Movimiento / Verdant Harvest - Supabase PostgreSQL DDL Schema
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com)
-- ==========================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  badge TEXT DEFAULT 'Cosecha de Hoy',
  image TEXT NOT NULL,
  recipe TEXT,
  stock_kg NUMERIC(10, 2) DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'PENDING',
  payment_method TEXT DEFAULT 'CASH_ON_DELIVERY',
  items_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Allow public insert access to orders
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow public read/update access to orders (for admin)
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- 4. Seed Default Produce Data into Supabase
INSERT INTO public.products (id, name, category, price, unit, badge, image, recipe, stock_kg)
VALUES
  ('prod-1', 'Tomates Cherry Orgánicos', 'verduras', 4.50, 'kg', 'Cosecha de Hoy', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADZS8vjaWNvP9A2Ct21Bt6TzoxT-mh5vLLxjbefvj3YvMAEkezLWMIV32gWghlealUEE5YFQZoCHpQ9pRdol8_LDNGBkd7oUdozCBNQgks3Hlkji56G30hw_1NANH820P-w3A257OUNzNw6b7x_-OYn4j-4VXZyR29HDhwqrFWXFbg0xWL0BSsZKJyhw0f2WOvjkTtKImll54Z3BbPm7Z-tAOIx2j3eSAuhrk9CS5o_nstJD3eaUcE', 'Ensalada César con Cherry', 100),
  ('prod-2', 'Zanahorias Orgánicas de Campo', 'organicos', 2.80, 'kg', '100% Orgánico', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbJGNHqnQYGLb734S4nV6yTvoE6nA39wDr19Tmx0fGWu5yJIEzr9Y6p3vcL-MMyJumVarJgkTYVvjQkANJOGyKUOSYFI1m9X4_oBSDWrr1mUNXhyfDQVnZ8Ul3mGQ0qATwLAVAEcF8Zu5sQVs37WeJPwsVpKsGEEsRIMPhMOTMarYzTQQA9fEJeC2VlcaIch-1Yvz-BD9EXumf7uiHSLvCKCvP76NNVOqSfze5pp3v0DK4lpyQPLH0', 'Crema de Zanahoria y Jengibre', 100),
  ('prod-3', 'Aguacate Hass Premium', 'frutas', 6.20, 'kg', 'Punto Óptimo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCteltVoG8moCPrIg7F3-Ea0zxrhxyxUbgow1t6tp-ibaobokh-8zegA7hFMXmkbBxU19ml-tX-ZuqgAvTpdyvll0UtPqWxsYpibOaNzgflzMj1rBsHhA0f-I-lkEJx6RneWw1otZvnVjmchSDytNeGhjcmBbWFPpkEv8GEroZqPDsCOPJHdKzuEEDik3EQFI4SQRw2Le1BfV4OheLqeAqNFBMz9xGtiGq525fLb2uolo0mMBiDKlYg', 'Tostada de Aguacate y Pepino', 100),
  ('prod-4', 'Caja Canasta de Temporada (Mixta)', 'packs', 18.50, 'caja', 'Más Vendido', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBONh-DN6pg8nWZvFsckLS2YhFkcPIVM63KaqR5ENld0_8B5yIeBAmW57O5DrRLapYohwK1LNf3lWPzEyKosagGVCXEfrIQDYEbCw_aQmEzaDG2Qp0ODuhyWq9gYi4nXwnWQpZnagGF3xt30qE2LHQLnaPGJS_1Un7Y9GOz162T9ZVXYrccmjUFwMOEbNrQLlzYRCUjI4cXQRZBJIOqzDCIeKqs5h9zC5vzpQ2yjKxKSZJwhbEts47o', 'Sopa Huerto Familiar', 50),
  ('prod-5', 'Selección de Frutas de Estación', 'frutas', 5.90, 'kg', 'Sabor Dulce', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2bPmYg5pp038WVVYEhVyf4iqjqRXq9PY1NI5WW-GFche_GNLOJvgmDk8JNT9q_E9u7P2TH9I9_K0NI6NiNUd9EK7oErr1GCh0PU0_CxNPXYEk1zqfCA2Q_vDsTYnoSfUDrsktM9cwG55qcCNFy0jy9pxlXarZHKDfaVa_8LTQ_iNgfl2JWKpsWAZutXxzlpAWf6B_vTmFAM_shzdOX452WXhfLOxrbsu4MigRcC29nMVPBmE2_96F', 'Bowl de Frutas del Campo', 80),
  ('prod-6', 'Pepino Cohombro Crujiente', 'verduras', 2.10, 'kg', 'Fresco', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqAYxM7mJdSjF7Q59eMnsS-ZJ5UzS5horkzSMracClJ2myLyI2k4EG6xEEGJfNx2h2tv-UwmX26BGiz5vTeuW4ZJwd4p9wjZXQZ7pNV0JRaror_o-v4yaSqwMDX7imS_mOwmWaLShcYzvQG96_9t3MFseHyx4AlIhaq41ijKV9moNbvzN1pGEcJYzA3eCIqoADWoYoOWTyjBwf6RMo1qqAqOePaZ1iBQ-1XUuhGABo1sMaiNROkrNU', 'Ensalada Griega Fresca', 120),
  ('prod-7', 'Raíces y Tubérculos Orgánicos', 'organicos', 3.40, 'kg', 'Del Agricultor', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7llXWznsocdOkHCFVfohLcXK0CHHwq7N2tfCzu35JWvFxaVgjj5gXYoEPcAJ1Si1n-3V0LuxFZtq1I6TXazd2HmWHcfu91TYT4j4VGetr7gyiwO0J9VNc4srsgyOyY48cypnk7V6fWALv0bWoZQJySKKg5fQKhZ7IlNeDHrABaGqpsMlfd7okthwnVaQxAoJKS7oOvJ_4tWvlshOMkkK3YLCL_VALCD66Wwxqy5emrM4AqdWd_Fb', 'Salteado Campestre', 90),
  ('prod-8', 'Pack Ensalada Mediterránea Completa', 'packs', 12.90, 'pack', 'Receta Incluida', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk_vgc_LPI8hw-RTyLL9DJ3SQ1N2iA5PEBT4XmBWv1s_tNjvkUbb0dwuNHSBOJuya3LKbfe7xtG43ggcPmaHrdNxNcjkHjoZ9d52wSJmlW3hgjD9603T7g-qmxILRbG0s0ZpfMy6b_pgaNck5kQe5HbZPStcnrfAW4lGJrNYuztn_lvu6PgLvmec3Ft7i03G7Y1QWbKUEyjsK6yeL-lWiKKZKFSR2Hp63Z9r26Kd9c7FDjSW7Obntp', 'Ensalada Mediterránea Vibrante', 40)
ON CONFLICT (id) DO NOTHING;
