-- Migration: Admin-Tabelle und Standard-Admin erstellen
-- Datum: 2025-12-31

-- Admin-Tabelle erstellen
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hinweis: Verwenden Sie das Setup-Script um den ersten Admin zu erstellen:
-- npm run create-admin
-- 
-- Dies erstellt einen Admin mit:
--   Username: admin
--   Passwort: admin123 (bcrypt-gehasht)
