export const DOMAIN =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://192.168.0.104:3001"
    : "";

export const VERSION = "v1";
export const BASE_URL = `${DOMAIN}/api/${VERSION}`;

export const BASE_AUTH_URL = `${BASE_URL}/auth`;
export const REGISTER_URL = `${BASE_AUTH_URL}/register`;
export const LOGIN_URL = `${BASE_AUTH_URL}/login`;
export const CHANGE_PASSWORD_URL = `${BASE_AUTH_URL}/changepassword`;

export const BASE_PROFILE_URL = `${BASE_URL}/profile`;
export const GET_PROFILE_URL = `${BASE_PROFILE_URL}/`;
export const EDIT_PROFILE_URL = `${BASE_PROFILE_URL}/`;
export const DELETE_PROFILE_URL = `${BASE_PROFILE_URL}/`;

export const BASE_GAME_URL = `${BASE_URL}/game`;
export const CREATE_GAME_URL = `${BASE_GAME_URL}/`;
export const JOIN_GAME_URL = `${BASE_GAME_URL}/join/`;
export const GET_GAME_URL = `${BASE_GAME_URL}/`;
export const GET_GAMES_URL = `${BASE_GAME_URL}/`;
export const ADD_MOVE_GAME_URL = `${BASE_GAME_URL}/move/`;
