CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Completed', 'Pending', 'Cancelled', 'Refunded')),
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_region ON transactions(region);
CREATE INDEX IF NOT EXISTS idx_status ON transactions(status);