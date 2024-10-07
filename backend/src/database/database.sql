CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    admin INTEGER DEFAULT 0
);

-- -- Insert admin user
-- INSERT INTO users (pseudo, email, password, admin) 
-- VALUES ('admin_user', 'admin@example.com', 'adminpassword', 1);
