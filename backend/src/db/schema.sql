CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_segment VARCHAR(50) NOT NULL DEFAULT 'Retail',
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  sales_channel VARCHAR(50) NOT NULL DEFAULT 'Online',
  payment_method VARCHAR(50) NOT NULL DEFAULT 'Credit Card',
  amount NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Completed', 'Pending', 'Cancelled', 'Refunded')),
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_region ON transactions(region);
CREATE INDEX IF NOT EXISTS idx_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_customer_segment ON transactions(customer_segment);
CREATE INDEX IF NOT EXISTS idx_sales_channel ON transactions(sales_channel);
CREATE INDEX IF NOT EXISTS idx_payment_method ON transactions(payment_method);