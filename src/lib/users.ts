import { PlaceHolderImages } from "./placeholder-images";
import type { User } from "./types";

export const users: User[] = [
    {
        id: "user-1",
        name: "NAVEEN.G",
        username: "nafadmin",
        avatar: PlaceHolderImages.find((img) => img.id === "avatar-1")!,
        bio: "The FOUNDER & CEO of the Kathaipom platform and NAFON studios. Ensuring stories are shared and heard.",
        coverImage: PlaceHolderImages.find((img) => img.id === "cover-1")!,
        followers: [],
        following: [],
        isAdmin: true,
    },
    {
        id: "user-2",
        name: "Jane Doe",
        username: "janedoe",
        avatar: PlaceHolderImages.find((img) => img.id === "avatar-2")!,
        bio: "Lover of fiction, coffee, and rainy days. Exploring the world one story at a time.",
        coverImage: PlaceHolderImages.find((img) => img.id === "cover-2")!,
        followers: [],
        following: [],
        isAdmin: false,
    },
    {
        id: "user-3",
        name: "John Smith",
        username: "johnsmith",
        avatar: PlaceHolderImages.find((img) => img.id === "avatar-3")!,
        bio: "Documenting my adventures in technology, travel, and gastronomy. Based in NYC.",
        coverImage: PlaceHolderImages.find((img) => img.id === "cover-3")!,
        followers: [],
        following: [],
        isAdmin: false,
    },
];
