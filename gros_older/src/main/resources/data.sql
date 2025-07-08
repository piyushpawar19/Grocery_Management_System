INSERT INTO registration (customer_name, email, password, address, contact_number, user_role) VALUES
('Admin User', 'admin@grocery.com', '$2a$12$icqHKnlbMFbnJa2Z2TKei.yGNDZl4c9l8MsJ4DTdxc1KT8zkHS2Qa', 'Admin Office, City', 9999999999, 'ADMIN'),
('John Customer', 'john@example.com', '$2a$12$L5PhWEbkXeyWVpYXr2nQCuUqTpAlju/mZkDzqRdnzd4TxXfAdBe3C', '123 Main St, USA', 1234567890, 'CUSTOMER');

INSERT INTO product (product_name, price, quantity, product_description) VALUES
('Fresh Apples', 2.99, 100, 'Red delicious apples'),
('Organic Bananas', 1.99, 150, 'Fresh organic bananas'),
('Whole Milk', 3.49, 50, 'Fresh whole milk 1 gallon'); 