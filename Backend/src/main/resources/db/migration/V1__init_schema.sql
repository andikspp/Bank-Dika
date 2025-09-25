-- 1. Role
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL -- e.g. 'CUSTOMER', 'TELLER', 'ADMIN'
);

-- 2. User
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES role(id),
    customer_id INTEGER REFERENCES customer(id), -- nullable, hanya untuk user nasabah
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer (Nasabah)
CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    ktp_number VARCHAR(30) UNIQUE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Account (Rekening)
CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id),
    account_number VARCHAR(30) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL, -- 'SAVINGS', 'CURRENT'
    balance NUMERIC(18,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'CLOSED'
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Transaction (Transaksi)
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES account(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'
    amount NUMERIC(18,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    reference_number VARCHAR(50)
);

-- 6. Audit Log
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_user(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);