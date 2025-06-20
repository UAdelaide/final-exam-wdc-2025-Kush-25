-- Create the database (this is a dummy file i generated to check if the server is working etc)
CREATE DATABASE IF NOT EXISTS DogWalkService;
USE DogWalkService;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100),
  password_hash VARCHAR(100),
  role ENUM('owner', 'walker') NOT NULL
);

-- Dogs table
CREATE TABLE IF NOT EXISTS Dogs (
  dog_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  size ENUM('small', 'medium', 'large'),
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

-- WalkRequests table
CREATE TABLE IF NOT EXISTS WalkRequests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  dog_id INT,
  requested_time DATETIME,
  duration_minutes INT,
  location VARCHAR(100),
  status ENUM('open', 'accepted') DEFAULT 'open',
  FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
);

-- WalkApplications table
CREATE TABLE IF NOT EXISTS WalkApplications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT,
  walker_id INT,
  FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
  FOREIGN KEY (walker_id) REFERENCES Users(user_id)
);

-- Insert test users
INSERT INTO Users (username, email, password_hash, role)
VALUES
  ('OwnerTest', 'owner@example.com', 'pass123', 'owner'),
  ('WalkerTest', 'walker@example.com', 'pass123', 'walker');

-- Insert test dog (owned by OwnerTest)
INSERT INTO Dogs (name, size, owner_id)
VALUES ('Buddy', 'medium', 1);
