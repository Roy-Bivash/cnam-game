interface CurrentUser {
    id: number,
    link: string,
    pseudo: string,
    email: string,
    admin: number,
    rank: number,
    wins: number,
    losses: number,
    created_at: string
}


export type {
    CurrentUser
}