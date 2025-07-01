
export type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string | null; // Clerk can send null for these
  lastName: string | null;  // Clerk can send null for these
  photo: string | null;
};

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
};