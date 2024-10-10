interface PlayerDeckCard {
    id: number;
    name: string;
    image_url: string;
    health: number;
    damage: number;
}

interface PlayerDeck {
    deck_id: number;
    deck_name: string;
    cards: Array<PlayerDeckCard>;
}

export type {
    PlayerDeckCard,
    PlayerDeck
};
