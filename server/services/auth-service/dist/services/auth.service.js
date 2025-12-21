import { authCollection } from "../models/auth.model";
export const getAllAuth = async () => {
    // DB call in real life
    return authCollection;
};
export const getAuthId = async (id) => {
    return authCollection.find((p) => p.id === id) || null;
};
