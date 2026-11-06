-- Morya FarmOS Database Schema
-- Multi-farm architecture
-- Intended for fresh database installations

CREATE DATABASE IF NOT EXISTS morya_farmos;
USE morya_farmos;

-- =====================================
-- 1. Farms
-- =====================================

CREATE TABLE IF NOT EXISTS farms (
    farm_id INT NOT NULL AUTO_INCREMENT,
    farm_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (farm_id)
) ENGINE=InnoDB;

-- =====================================
-- 2. Users
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
-- 3. Cows
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
-- 4. Breeding Records
-- =====================================

CREATE TABLE IF NOT EXISTS breeding_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    cow_id VARCHAR(30) NOT NULL,
    insemination_date DATE NOT NULL,
    pregnancy_status ENUM(
        'Pending',
        'Confirmed',
        'Not Pregnant'
    ) NOT NULL DEFAULT 'Pending',
    confirmation_date DATE NULL,
    expected_delivery_date DATE NULL,
    actual_delivery_date DATE NULL,
    description TEXT,

    CONSTRAINT fk_breeding_cow
        FOREIGN KEY (cow_id)
        REFERENCES cows(cow_id)
) ENGINE=InnoDB;

-- =====================================
-- 5. Expenses
-- =====================================

CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT NOT NULL AUTO_INCREMENT,
    expense_date DATE NOT NULL,
    category VARCHAR(60) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL,
    description TEXT,
    farm_id INT DEFAULT NULL,

    PRIMARY KEY (expense_id)
) ENGINE=InnoDB;

-- =====================================
-- 6. Milk Records
-- =====================================

CREATE TABLE IF NOT EXISTS milk_records (
    record_id INT NOT NULL AUTO_INCREMENT,
    farm_id INT NOT NULL,
    record_date DATE NOT NULL,
    session VARCHAR(20) NOT NULL DEFAULT 'Morning',
    quantity DECIMAL(8,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notes VARCHAR(255) DEFAULT NULL,

    PRIMARY KEY (record_id)
) ENGINE=InnoDB;

 ALTER TABLE milk_records ADD COLUMN amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
