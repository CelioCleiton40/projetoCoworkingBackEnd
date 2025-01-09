-- Ativa o suporte a chaves estrangeiras
PRAGMA foreign_keys = ON;

-- Inicia uma transação (opcional, mas recomendado para garantir a consistência)
BEGIN TRANSACTION;

-- Cria a tabela users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    document_type TEXT CHECK(document_type IN ('CPF', 'CNPJ')),
    document_number TEXT UNIQUE,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela spaces
CREATE TABLE IF NOT EXISTS spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK(capacity > 0),
    hourly_rate REAL NOT NULL CHECK(hourly_rate >= 0),
    description TEXT,
    amenities TEXT,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'maintenance', 'reserved')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela services
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    duration_minutes INTEGER,
    available INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    space_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_price REAL NOT NULL CHECK(total_price >= 0),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (space_id) REFERENCES spaces (id)
);

-- Cria a tabela products
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    stock INTEGER NOT NULL CHECK(stock >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insere dados de exemplo na tabela users (USANDO HASH DE SENHA - exemplo com bcrypt em JavaScript)
INSERT INTO users (name, email, password_hash, is_admin)
VALUES
    ('Administrador', 'admin@email.com', '$2b$10$SEk/hU7f5O6Q6y5l4l/O9u9/1h7oQ2.p.t6e0.6Q8O.i.z3.5z', 1), -- Senha: admin123
    ('Usuário Teste 1', 'teste1@email.com', '$2b$10$SEk/hU7f5O6Q6y5l4l/O9u9/1h7oQ2.p.t6e0.6Q8O.i.z3.5z', 0), -- Senha: teste123
    ('Usuário Teste 2', 'teste2@email.com', '$2b$10$SEk/hU7f5O6Q6y5l4l/O9u9/1h7oQ2.p.t6e0.6Q8O.i.z3.5z', 0); -- Senha: teste123

-- Insere dados de exemplo na tabela spaces
INSERT INTO spaces (name, capacity, hourly_rate, description, amenities, status)
VALUES
    ('Sala de Reuniões 1', 10, 50.00, 'Sala para reuniões com até 10 pessoas.', 'Wi-Fi, projetor, ar condicionado', 'available'),
    ('Espaço de Coworking 1', 20, 25.00, 'Espaço compartilhado para trabalho.', 'Wi-Fi, tomadas, mesas individuais', 'available');

-- Insere dados de exemplo na tabela services
INSERT INTO services (name, description, price, duration_minutes)
VALUES
    ('Impressão P&B', 'Impressão em preto e branco.', 0.50, NULL),
    ('Impressão Colorida', 'Impressão colorida.', 1.00, NULL),
    ('Café', 'Café expresso.', 5.00, NULL);

-- Insere dados de exemplo na tabela products
INSERT INTO products (name, description, price, stock)
VALUES
    ('Caderno', 'Caderno universitário 100 folhas.', 10.00, 50),
    ('Caneta', 'Caneta esferográfica azul.', 2.00, 100);

-- Insere dados de exemplo na tabela bookings
INSERT INTO bookings (user_id, space_id, start_time, end_time, total_price, status, notes)
VALUES
    (1, 1, '2024-11-10 09:00:00', '2024-11-10 12:00:00', 150.00, 'confirmed', 'Reunião com cliente.'),
    (2, 2, '2024-11-11 14:00:00', '2024-11-11 16:00:00', 50.00, 'pending', NULL);

-- Finaliza a transação
COMMIT;
