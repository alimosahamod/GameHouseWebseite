-- Billardtische
CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Öffnungszeiten (generisch für Wochentage)
CREATE TABLE IF NOT EXISTS opening_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week INT NOT NULL, -- 0=Sonntag, 1=Montag, ..., 6=Samstag
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_day (day_of_week)
);

-- Blackout-Zeiten (z.B. Wartung, Events)
CREATE TABLE IF NOT EXISTS blackouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
    INDEX idx_blackout_time (start_time, end_time)
);

-- Reservierungen
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
    INDEX idx_reservation_time (table_id, start_time, end_time)
);

-- Standard-Öffnungszeiten einfügen (Mo-So: 16:00-22:00)
INSERT INTO opening_hours (day_of_week, open_time, close_time) VALUES
(0, '14:00:00', '02:00:00'), -- Sonntag
(1, '16:00:00', '00:00:00'), -- Montag
(2, '16:00:00', '00:00:00'), -- Dienstag
(3, '16:00:00', '00:00:00'), -- Mittwoch
(4, '16:00:00', '00:00:00'), -- Donnerstag
(5, '16:00:00', '00:00:00'), -- Freitag
(6, '14:00:00', '02:00:00'); -- Samstag

-- Beispiel-Billardtische
INSERT INTO tables (name, description) VALUES
('Tisch 1', 'Billiardtisch 1'),
('Tisch 2', 'Billiardtisch 2'),
('Tisch 3', 'Billiardtisch 3'),
('Tisch 4', 'Billiardtisch 4'),
('Tisch 5', 'Billiardtisch 5'),
('Tisch 6', 'Billiardtisch 6');

