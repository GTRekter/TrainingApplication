-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS testdb;

-- Use the testdb database
USE testdb;

-- Create the users table if it does not exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);