CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    email VARCHAR(1000),
    name VARCHAR(1000),
    picture VARCHAR(1000),
    provider VARCHAR(50),
    provider_id VARCHAR(255),
    access_token VARCHAR(255),
    refresh_token VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);