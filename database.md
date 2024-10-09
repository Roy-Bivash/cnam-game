### 1. **Players Table**
This table will store the information of each player (username, email, password, rank, etc.).

| Column Name    | Data Type       | Description                              |
|----------------|-----------------|------------------------------------------|
| `player_id`    | INT (PK)        | Unique identifier for each player.       |
| `pseudo`       | VARCHAR(50)     | The player's username or pseudonym.      |
| `email`        | VARCHAR(100)    | Player's email address (unique).         |
| `password`     | VARCHAR(255)    | Password hash for security.              |
| `rank`         | INT             | Player's current rank.                   |
| `wins`         | INT             | Number of wins.                          |
| `losses`       | INT             | Number of losses.                        |
| `created_at`   | DATETIME        | When the player registered.              |

### 2. **Cards Table**
This table will store information about all available cards.

| Column Name    | Data Type       | Description                              |
|----------------|-----------------|------------------------------------------|
| `card_id`      | INT (PK)        | Unique identifier for each card.         |
| `image_url`    | VARCHAR(255)    | URL or path to the card's image.         |
| `health`       | INT             | The health points of the card.           |
| `damage`       | INT             | The damage points of the card.           |

### 3. **Card Tags Table**
Since a card can have multiple tags (types), a many-to-many relationship between cards and tags is needed. We create a separate table to handle this relationship.

#### Tags Table
This will store all possible tags.

| Column Name    | Data Type       | Description                              |
|----------------|-----------------|------------------------------------------|
| `tag_id`       | INT (PK)        | Unique identifier for each tag.          |
| `tag_name`     | VARCHAR(50)     | Tag name (e.g., "attack", "defense").    |

#### Card_Tags Table
This will store the relationship between `cards` and `tags`.

| Column Name    | Data Type       | Description                              |
|----------------|-----------------|------------------------------------------|
| `card_id`      | INT (FK)        | Foreign key from `cards` table.          |
| `tag_id`       | INT (FK)        | Foreign key from `tags` table.           |

### 4. **Decks Table**
A player can create multiple decks, and each deck can contain up to 5 cards. We'll create a separate table to manage player decks.

| Column Name    | Data Type       | Description                              |
|----------------|-----------------|------------------------------------------|
| `deck_id`      | INT (PK)        | Unique identifier for each deck.         |
| `player_id`    | INT (FK)        | Foreign key from `players` table.        |
| `deck_name`    | VARCHAR(50)     | Name of the deck.                        |

### 5. **Deck_Cards Table**
Since each deck can hold multiple cards (up to 5), we need a separate table to represent the many-to-many relationship between decks and cards.

| Column Name    | Data Type       | Description                              |
|----------------|-----------------|------------------------------------------|
| `deck_id`      | INT (FK)        | Foreign key from `decks` table.          |
| `card_id`      | INT (FK)        | Foreign key from `cards` table.          |

### Relationships
- **Player to Deck**: A player can have many decks (1-to-many).
- **Deck to Cards**: A deck can have many cards (many-to-many), and each card can belong to multiple decks.
- **Card to Tags**: Each card can have multiple tags (many-to-many).

### ER Diagram Overview
- **Player** → Has multiple **Decks**.
- **Deck** → Contains multiple **Cards** (up to 5).
- **Card** → Can have multiple **Tags** through a junction table.
