-- Morya FarmOS Database Schema
-- Simplified for easy presentation

CREATE DATABASE IF NOT EXISTS morya_farmos;
USE morya_farmos;

-- =====================================
-- 1. Farms Table
-- =====================================
CREATE TABLE IF NOT EXISTS farms (
    farm_id INT NOT NULL AUTO_INCREMENT,
    farm_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (farm_id)
) ENGINE=InnoDB;

-- =====================================
-- 2. Users Table
-- =====================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    farm_id INT DEFAULT NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- =====================================
-- 3. Cows Table
-- =====================================
CREATE TABLE IF NOT EXISTS cows (
    cow_id VARCHAR(30) NOT NULL,
    cow_name VARCHAR(100) NOT NULL,
    date_of_birth DATE DEFAULT NULL,
    birth_date_is_estimated BOOLEAN NOT NULL DEFAULT FALSE,
    breed VARCHAR(100) DEFAULT NULL,
    description TEXT,
    farm_id INT DEFAULT NULL,
    PRIMARY KEY (cow_id)
) ENGINE=InnoDB;

-- =====================================
-- 4. Expenses Table
-- =====================================
CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT NOT NULL AUTO_INCREMENT,
    farm_id INT DEFAULT NULL,
    expense_date DATE NOT NULL,
    category VARCHAR(60) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL,
    description TEXT,
    PRIMARY KEY (expense_id)
) ENGINE=InnoDB;

-- =====================================
-- 5. Default Seed Accounts (Password: Password1234!)
-- =====================================
INSERT INTO farms (farm_id, farm_name) 
VALUES (1, 'Morya Model Dairy Farm')
ON DUPLICATE KEY UPDATE farm_name=VALUES(farm_name);

INSERT INTO users (user_id, full_name, email, password_hash, role, farm_id)
VALUES 
  (1, 'Super Admin', 'admin@morya.com', '$2b$12$MzJcZKhtysgPRpFyiMe8IuvmAha4LUV9ITL3NyNHc1Ir/BB15Q/3u', 'admin', NULL),
  (2, 'Farm Owner', 'owner@morya.com', '$2b$12$MzJcZKhtysgPRpFyiMe8IuvmAha4LUV9ITL3NyNHc1Ir/BB15Q/3u', 'user', 1)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
