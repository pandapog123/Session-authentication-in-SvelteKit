import { invalidateAll } from "$app/navigation";
import { signOut } from "$lib/auth.js";
import { SESSION_COOKIE_NAME } from "$lib/constants.js";

export const actions = {
  logout: async ({ cookies }) => {
    const sessionId = cookies.get(SESSION_COOKIE_NAME);

    if (!sessionId) {
      return {};
    }

    try {
      signOut(sessionId);
      cookies.delete(SESSION_COOKIE_NAME);
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
    }

    return {};
  },
};
