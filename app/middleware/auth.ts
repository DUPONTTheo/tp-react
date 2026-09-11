import {
  createContext,
  redirect,
  type RouterContextProvider,
} from "react-router";
import type { User } from "~/types/auth";

export const RouterAuthContext = createContext<User | null>(null);

const USER_STORAGE_KEY = "user";

function isUser(user: unknown): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    "username" in user &&
    typeof user.username === "string"
  );
}

function getStoredUser(): User | null {
  const serializedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!serializedUser) {
    return null;
  }

  try {
    const user: unknown = JSON.parse(serializedUser);

    if (isUser(user)) {
      return user;
    }
  } catch {
    // Invalid persisted state is treated as a signed-out user.
  }

  localStorage.removeItem(USER_STORAGE_KEY);
  return null;
}

export async function authMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const user = getStoredUser();

  if (!user) {
    throw redirect("/login");
  }

  context.set(RouterAuthContext, user);
}
