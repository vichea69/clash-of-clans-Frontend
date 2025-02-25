export interface BaseFormData {
    name: string;
    link: string;
    image: File | null;
}

export interface Base {
    id: string;
    name: string;
    link: string;
    imageUrl: string;
    createdAt: string;
    // Add other fields as needed
} 