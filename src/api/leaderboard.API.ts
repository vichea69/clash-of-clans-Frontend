import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    throw new Error('VITE_API_URL environment variable is not defined');
}

export interface LeaderboardPlayer {
    tag: string;
    name: string;
    expLevel: number;
    trophies: number;
    attackWins: number;
    defenseWins: number;
    rank: number;
    previousRank?: number;
    clan?: {
        tag: string;
        name: string;
        badgeUrls: {
            small: string;
            large: string;
            medium: string;
        };
    };
    league?: {
        id: number;
        name: string;
        iconUrls: {
            small: string;
            tiny: string;
            medium: string;
        };
    };
}

export interface LeaderboardResponse {
    success: boolean;
    items: LeaderboardPlayer[];
}

class LeaderboardAPI {
    private static instance: LeaderboardAPI;
    private readonly baseURL: string;
    private readonly cocApiToken: string;

    private constructor() {
        this.baseURL = `${API_BASE_URL}/leaderboard`;
        this.cocApiToken = import.meta.env.VITE_COC_API_TOKEN || '';
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cocApiToken}`,
        };
    }

    public static getInstance(): LeaderboardAPI {
        if (!LeaderboardAPI.instance) {
            LeaderboardAPI.instance = new LeaderboardAPI();
        }
        return LeaderboardAPI.instance;
    }

    /**
     * Get global legend league leaderboard
     */
    async getGlobalLeaderboard(): Promise<LeaderboardResponse> {
        try {
            const response = await axios.get(`${this.baseURL}/legend/global`, {
                headers: this.getHeaders(),
            });

            console.log('API URL:', `${this.baseURL}/legend/global`);
            console.log('Raw Response Data:', response.data);

            // The response.data.data contains the array of players
            const items = response.data.data || [];

            return {
                success: true,
                items
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error Details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            }
            throw error;
        }
    }

    /**
     * Get local leaderboard by location ID
     */
    async getLocalLeaderboard(locationId: string): Promise<LeaderboardResponse> {
        try {
            const response = await axios.get(`${this.baseURL}/legend/local/${locationId}`, {
                headers: this.getHeaders(),
            });

            const items = Array.isArray(response.data) ? response.data : response.data?.items || [];

            return {
                success: true,
                items
            };
        } catch (error) {
            console.error('Error fetching local leaderboard:', error);
            throw error;
        }
    }

    /**
     * Get paginated leaderboard data
     */
    async getPaginatedLeaderboard(params: {
        limit?: number;
        before?: string;
        after?: string;
    }): Promise<LeaderboardResponse> {
        try {
            const response = await axios.get(`${this.baseURL}`, {
                params,
                headers: this.getHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated leaderboard:', error);
            throw error;
        }
    }
}

export const leaderboardAPI = LeaderboardAPI.getInstance();
export default leaderboardAPI;
