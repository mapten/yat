CREATE DATABASE todoapp;

CREATE TABLE todo {
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  title VARCHAR(255),
  priority INT,
  progress INT,
  done BOOLEAN
};

CREATE TABLE user {
  email VARCHAR(255) PRIMARY KEY,
  hashed_password VARCHAR(255),
};

INSERT INTO todo (id, user_email, title, priority, progress, done) VALUES
  ('1', 'marcos@test.com', 'Paint the wall', 3, 0, false),
  ('2', 'marcos@test.com', 'Create a todoList demo application', 0, 0, true),
  ('3', 'marcos@test.com', 'Learn Kubernetes', 2, 0, false),
  ('4', 'marcos@test.com', 'Buy an ukelele', 0, 0, true),
  ('5', 'marcos@test.com', 'Learn to play ukelele', 1, 0, false),
  ('6', 'marcos@test.com', 'Sell ukelele', 1, 0, true);