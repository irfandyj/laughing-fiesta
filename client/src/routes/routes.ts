/**
 * Routes for pushing to the history stack
 */

export const USER_BASE_PATH = '/u';
export const ROOM_BASE_PATH = `${USER_BASE_PATH}/:username/rooms`;
export enum Routes {
  HOME = USER_BASE_PATH + '/:username',
  ROOM_DETAIL = ROOM_BASE_PATH + '/:id',

  // Unauthenticated routes
  SIGN_UP = '/signup',
  SIGN_IN = '/signin',
  FORGOT_PASSWORD = '/forgot-password',
}