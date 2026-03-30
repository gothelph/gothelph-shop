interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  username: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const validateLoginPayload = (payload: unknown) => {
  if (!isObject(payload)) {
    return { valid: false as const, details: "Body must be a JSON object" };
  }

  const email = payload.email;
  const password = payload.password;

  if (typeof email !== "string" || !emailRegex.test(email)) {
    return { valid: false as const, details: "Invalid email format" };
  }

  if (typeof password !== "string" || password.length < 8) {
    return {
      valid: false as const,
      details: "Password must be at least 8 characters",
    };
  }

  return {
    valid: true as const,
    data: {
      email,
      password,
    } satisfies LoginPayload,
  };
};

export const validateRegisterPayload = (payload: unknown) => {
  if (!isObject(payload)) {
    return { valid: false as const, details: "Body must be a JSON object" };
  }

  const username = payload.username;
  const email = payload.email;
  const password = payload.password;

  if (typeof username !== "string" || username.trim().length < 3) {
    return {
      valid: false as const,
      details: "Username must be at least 3 characters",
    };
  }

  if (username.length > 32) {
    return { valid: false as const, details: "Username is too long" };
  }

  if (typeof email !== "string" || !emailRegex.test(email)) {
    return { valid: false as const, details: "Invalid email format" };
  }

  if (typeof password !== "string" || password.length < 8) {
    return {
      valid: false as const,
      details: "Password must be at least 8 characters",
    };
  }

  if (password.length > 128) {
    return { valid: false as const, details: "Password is too long" };
  }

  return {
    valid: true as const,
    data: {
      username: username.trim(),
      email,
      password,
    } satisfies RegisterPayload,
  };
};
