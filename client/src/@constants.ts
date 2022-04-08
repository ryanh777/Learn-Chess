export const initialState = {
  username: "",
  password: "",
  error: "",
  isLoading: false,
  isLoggedIn: false,
};

export interface User {
  username: string;
  whiteRootID: string;
  blackRootID: string;
}

export type LoginState = {
  username: string;
  password: string;
  error: string;
  isLoading: boolean;
  isLoggedIn: boolean;
};

export type LoginAction =
  | { type: "field"; fieldName: string; payload: string }
  | { type: "login" }
  | { type: "success" }
  | { type: "error" }
  | { type: "logout" };
