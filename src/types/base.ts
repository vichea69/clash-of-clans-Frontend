export interface BaseFormData {
    name: string;
    link: string;
    image: File | null;
}

export interface Base {
    id: number;
    name: string;
    imageUrl: string;
    link: string;
    createdAt?: string;
    updatedAt?: string;
    user: {
        name: string;
        avatar?: string;
    };
    clerkUserId?: string;
} 