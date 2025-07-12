INSERT INTO registration (customer_name, email, password, address, contact_number, user_role) VALUES
('Admin User', 'admin@grocery.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Admin Office, City', 9999999999, 'ADMIN'),
('John Customer', 'john@example.com', '$2a$12$L5PhWEbkXeyWVpYXr2nQCuUqTpAlju/mZkDzqRdnzd4TxXfAdBe3C', '123 Main St, USA', 1234567890, 'CUSTOMER'),
('Piyush Pawar', 'piyushpawar193@gmail.com', '$2a$10$.jKQIdMtYStdSYNsBAqgmuHdHVSWfMbAY8DPDrjiQLkhKOTObRsMW', 'Indore', 6268212347, 'CUSTOMER'),
('Jane Customer', 'jane@example.com', '$2a$12$L5PhWEbkXeyWVpYXr2nQCuUqTpAlju/mZkDzqRdnzd4TxXfAdBe3C', '456 Oak St, USA', 9876543210, 'CUSTOMER'),
('Bob Customer', 'bob@example.com', '$2a$12$L5PhWEbkXeyWVpYXr2nQCuUqTpAlju/mZkDzqRdnzd4TxXfAdBe3C', '789 Pine St, USA', 5555555555, 'CUSTOMER');

INSERT INTO product (product_name, price, quantity, product_description) VALUES
('Fresh Apples', 2.99, 100, 'Red delicious apples'),
('Organic Bananas', 1.99, 150, 'Fresh organic bananas'),
('Whole Milk', 3.49, 50, 'Fresh whole milk 1 gallon'); 