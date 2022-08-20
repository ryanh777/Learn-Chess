import { LoginActionType, LoginStateType } from "../@types";

export const loginReducer = (
  state: LoginStateType,
  action: LoginActionType
) => {
  switch (action.type) {
    case "field": {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
    case "login": {
      return {
        ...state,
        error: "",
        isLoading: true,
      };
    }
    case "success": {
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
      };
    }
    case "error": {
      return {
        ...state,
        error: action.payload,
        isLoggedIn: false,
        isLoading: false,
        // username: "",
        // password: "",
      };
    }
    case "logout": {
      return {
        ...state,
        isLoggedIn: false,
        username: "",
        password: "",
      };
    }
    default:
      return state;
  }
};
