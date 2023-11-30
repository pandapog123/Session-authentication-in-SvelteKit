import { fail, redirect } from "@sveltejs/kit";
import { createUser } from "$lib/auth";
import { SESSION_COOKIE_NAME } from "$lib/constants";

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const registerResult = createUser(email, password);

      cookies.set(SESSION_COOKIE_NAME, registerResult.id, {
        path: "/",
        httpOnly: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, {
          email,
          password,
          message: error.message,
        });
      } else {
        return fail(500, {
          email,
          password,
          message: "Unknown error occured in server",
        });
      }
    }

    throw redirect(303, "/");
  },
};
