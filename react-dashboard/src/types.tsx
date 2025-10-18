export interface WikimediaChange {
    bot: boolean;
    user: string;
    server_name: string;
    type: string;
    title: string;
    id: number;
    timestamp: number;
    key?: string; // Optional key for React lists
}

export interface Metrics {
    totalChanges: number;
    botChanges: number;
    humanChanges: number;
    wikiCounts: Record<string, number>;
}

export interface FilterState {
    type: 'All' | 'Bot' | 'Human';
    domain: string;
}
