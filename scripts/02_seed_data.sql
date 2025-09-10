-- Script para insertar datos de ejemplo en el sistema
-- Ejecutar después de 01_create_tables.sql

-- Insertar configuración del restaurante
INSERT INTO restaurant_config (name, address, phone, email, tax_id, currency, tax_rate, service_charge) 
VALUES ('Mi Restaurante', 'Calle Principal 123, Ciudad', '+1 234 567 8900', 'contacto@mirestaurante.com', '12345678-9', 'USD', 18.00, 10.00);

-- Insertar usuarios de ejemplo
INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES
('admin', 'admin@restaurant.com', '$2b$10$example_hash_admin', 'admin', 'Administrador Principal', '+1 234 567 8901'),
('mesero1', 'mesero1@restaurant.com', '$2b$10$example_hash_waiter1', 'waiter', 'Juan Pérez', '+1 234 567 8902'),
('mesero2', 'mesero2@restaurant.com', '$2b$10$example_hash_waiter2', 'waiter', 'María García', '+1 234 567 8903'),
('cajero1', 'cajero1@restaurant.com', '$2b$10$example_hash_cashier1', 'cashier', 'Carlos López', '+1 234 567 8904');

-- Insertar categorías de ejemplo
INSERT INTO categories (name, description, color) VALUES
('Entradas', 'Aperitivos y entradas', '#ef4444'),
('Platos Principales', 'Platos fuertes y principales', '#f97316'),
('Postres', 'Dulces y postres', '#eab308'),
('Bebidas', 'Bebidas frías y calientes', '#3b82f6'),
('Ensaladas', 'Ensaladas frescas', '#22c55e');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, category_id, ingredients, allergens, preparation_time) VALUES
('Ceviche Clásico', 'Pescado fresco marinado en limón con cebolla y ají', 18.50, 1, ARRAY['pescado', 'limón', 'cebolla', 'ají', 'cilantro'], ARRAY['pescado'], 15),
('Lomo Saltado', 'Carne de res salteada con papas fritas y arroz', 22.00, 2, ARRAY['carne de res', 'papas', 'cebolla', 'tomate', 'arroz'], ARRAY[], 20),
('Ají de Gallina', 'Pollo deshilachado en salsa cremosa de ají amarillo', 19.50, 2, ARRAY['pollo', 'ají amarillo', 'leche', 'pan', 'nueces'], ARRAY['lácteos', 'frutos secos'], 25),
('Tiradito de Pescado', 'Pescado en finas láminas con salsa de ají amarillo', 16.00, 1, ARRAY['pescado', 'ají amarillo', 'limón'], ARRAY['pescado'], 12),
('Suspiro Limeño', 'Postre tradicional de manjar blanco y merengue', 8.50, 3, ARRAY['leche condensada', 'huevos', 'azúcar', 'vainilla'], ARRAY['lácteos', 'huevos'], 10),
('Chicha Morada', 'Bebida tradicional de maíz morado', 5.00, 4, ARRAY['maíz morado', 'piña', 'canela', 'clavo'], ARRAY[], 5),
('Ensalada Mixta', 'Lechuga, tomate, pepino y palta', 12.00, 5, ARRAY['lechuga', 'tomate', 'pepino', 'palta'], ARRAY[], 8);

-- Insertar mesas de ejemplo
INSERT INTO tables (number, capacity, position_x, position_y) VALUES
(1, 2, 100, 100),
(2, 4, 250, 100),
(3, 6, 400, 100),
(4, 2, 100, 250),
(5, 4, 250, 250),
(6, 8, 400, 250),
(7, 2, 100, 400),
(8, 4, 250, 400);

-- Insertar items de inventario de ejemplo
INSERT INTO inventory_items (name, category, unit, current_stock, min_stock, unit_cost, supplier) VALUES
('Pescado Fresco', 'Proteínas', 'kg', 25.5, 5.0, 12.50, 'Pescadería Central'),
('Carne de Res', 'Proteínas', 'kg', 18.2, 3.0, 15.80, 'Carnicería Premium'),
('Pollo', 'Proteínas', 'kg', 22.0, 5.0, 8.90, 'Avícola San Juan'),
('Arroz', 'Granos', 'kg', 50.0, 10.0, 2.20, 'Distribuidora Granos'),
('Papas', 'Vegetales', 'kg', 35.5, 8.0, 1.80, 'Mercado Central'),
('Cebolla', 'Vegetales', 'kg', 15.2, 3.0, 1.50, 'Mercado Central'),
('Limón', 'Frutas', 'kg', 12.8, 2.0, 3.20, 'Frutería La Esperanza'),
('Ají Amarillo', 'Condimentos', 'kg', 5.5, 1.0, 8.50, 'Especias del Perú');

-- Insertar algunas transacciones de inventario de ejemplo
INSERT INTO inventory_transactions (item_id, type, quantity, unit_cost, total_cost, reference, user_id) VALUES
(1, 'purchase', 30.0, 12.50, 375.00, 'Compra inicial', 1),
(2, 'purchase', 20.0, 15.80, 316.00, 'Compra inicial', 1),
(3, 'purchase', 25.0, 8.90, 222.50, 'Compra inicial', 1),
(1, 'usage', -4.5, 12.50, -56.25, 'Preparación ceviche', 2);
