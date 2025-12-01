import { authCollection, Auth } from "../models/auth.model";

export const getAllAuth = async (): Promise<Auth[]> => {
  // DB call in real life
  return authCollection;
};

export const getAuthId = async (id: string): Promise<Auth | null> => {
  return authCollection.find((p) => p.id === id) || null;
};
