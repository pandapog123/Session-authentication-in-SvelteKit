import { get, writable } from "svelte/store";
import { v4 as uuid } from "uuid";

export type User = {
  id: string;
  email: string;
  password: string;
};

export type Session = {
  id: string;
  userId: string;
};

const usersStore = writable<User[]>([]);
const sessionsStore = writable<Session[]>([]);

export function validateSession(id: string) {
  const sessions = get(sessionsStore);

  const sessionResult = sessions.find((session) => session.id === id);

  if (!sessionResult) {
    throw new Error("Session does not exist");
  }

  const users = get(usersStore);

  const userResult = users.find((user) => user.id === sessionResult.userId);

  if (!userResult) {
    throw new Error("User does not exist");
  }

  return {
    sessionResult,
    userResult,
  };
}

export function createUser(email: string, password: string) {
  const emailValidationResult = validateEmail(email);

  if (emailValidationResult.error) {
    throw new Error(emailValidationResult.message);
  }

  const passwordValidationResult = validatePassword(password);

  if (passwordValidationResult.error) {
    throw new Error(passwordValidationResult.message);
  }

  const currentUsers = get(usersStore);

  const newUser: User = {
    email,
    password,
    id: uuid(),
  };

  const duplicateEmail = currentUsers.find((user) => {
    return user.email === newUser.email;
  });

  if (duplicateEmail) {
    throw new Error("User already exists");
  }

  usersStore.update((previousUsers) => {
    return [...previousUsers, newUser];
  });

  return createSessionById(newUser.id);
}

export function createSessionByEmail(email: string, password: string) {
  const emailValidationResult = validateEmail(email);

  if (emailValidationResult.error) {
    throw new Error(emailValidationResult.message);
  }

  const passwordValidationResult = validatePassword(password);

  if (passwordValidationResult.error) {
    throw new Error(passwordValidationResult.message);
  }

  const currentUsers = get(usersStore);

  const userFound = currentUsers.find((user) => {
    return user.email === email && user.password === password;
  });

  if (!userFound) {
    const userWithSameEmail = currentUsers.find((user) => user.email === email);

    if (userWithSameEmail) {
      throw new Error("Password is invalid");
    }

    throw new Error("User not found");
  }

  return createSessionById(userFound.id);
}

function createSessionById(userId: string) {
  const users = get(usersStore);

  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newSession: Session = {
    id: uuid(),
    userId,
  };

  sessionsStore.update((previousSessions) => {
    const filteredSessions = previousSessions.filter(
      (session) => session.userId !== userId
    );

    return [...filteredSessions, newSession];
  });

  return newSession;
}

export function validateEmail(email: string) {
  const emailRegex = /[-A-Za-z0-9_.%]+@[-A-Za-z0-9_.%]+\.[A-Za-z]+/gm;

  const emailRegexExec = emailRegex.exec(email);

  if (emailRegexExec && emailRegexExec[0] === email) {
    return {
      success: true,
    };
  }

  return {
    error: true,
    message: "Email is invalid",
  };
}

export function validatePassword(password: string) {
  const requiredLength = password.length > 7;

  if (!requiredLength) {
    return {
      error: true,
      message: "Password must be at least 8 characters in length",
    };
  }

  return { success: true };
}

export function signOut(id: string) {
  const sessions = get(sessionsStore);

  const sessionFound = sessions.find((session) => session.id === id);

  if (!sessionFound) {
    throw new Error("Session not found");
  }

  sessionsStore.update((previousSessions) => {
    return previousSessions.filter((session) => session != sessionFound);
  });
}
