-- 1. Players Table
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    admin BOOLEAN NOT NULL DEFAULT 0,
    password VARCHAR(255) NOT NULL,
    rank INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cards Table
CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url VARCHAR(255),
    health INTEGER NOT NULL,
    damage INTEGER NOT NULL
);

-- 3. Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_name VARCHAR(50) NOT NULL
);

-- 4. Card_Tags Table (Junction table for cards and tags)
CREATE TABLE IF NOT EXISTS card_tags (
    card_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (card_id) REFERENCES cards(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    PRIMARY KEY (card_id, tag_id)
);

-- 5. Decks Table
CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    deck_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id)
);

-- 6. Deck_Cards Table (Junction table for decks and cards)
CREATE TABLE IF NOT EXISTS deck_cards (
    deck_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    FOREIGN KEY (deck_id) REFERENCES decks(id),
    FOREIGN KEY (card_id) REFERENCES cards(id),
    PRIMARY KEY (deck_id, card_id)
);

-- Create indexes to optimize searches
CREATE INDEX IF NOT EXISTS idx_player_email ON players (email);
CREATE INDEX IF NOT EXISTS idx_card_health ON cards (health);
CREATE INDEX IF NOT EXISTS idx_tag_name ON tags (tag_name);
