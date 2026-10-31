-- Morya FarmOS planned database schema (review before deployment)
CREATE DATABASE IF NOT EXISTS morya_farmos;
USE morya_farmos;

CREATE TABLE IF NOT EXISTS cows (
  cow_id VARCHAR(30) PRIMARY KEY,
  cow_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NULL,
  birth_date_is_estimated BOOLEAN NOT NULL DEFAULT FALSE,
  breed VARCHAR(100),
  description TEXT
);

CREATE TABLE IF NOT EXISTS breeding_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  cow_id VARCHAR(30) NOT NULL,
  insemination_date DATE NOT NULL,
  pregnancy_status ENUM('Pending', 'Confirmed', 'Not Pregnant') NOT NULL DEFAULT 'Pending',
  confirmation_date DATE NULL,
  expected_delivery_date DATE NULL,
  actual_delivery_date DATE NULL,
  description TEXT,
  CONSTRAINT fk_breeding_cow FOREIGN KEY (cow_id) REFERENCES cows(cow_id)
);

CREATE TABLE IF NOT EXISTS expenses (
  expense_id INT AUTO_INCREMENT PRIMARY KEY,
  expense_date DATE NOT NULL,
  category VARCHAR(60) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode VARCHAR(30) NOT NULL,
  description TEXT
);
