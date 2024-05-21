import { Model } from '..';
import { ProfileModelType, ProfileModelState, ProfileHashmap } from './profile.types';
import { PROFILE_REDUCERS } from './profile.constants';

const profileReducers: ProfileModelType['reducers'] = {
  /**
   * Set the current chosen index profile
   * @param state 
   * @param action 
   * @returns 
   */
  [PROFILE_REDUCERS.SET_INDEX_PROFILE](state, action) {
    const currentState = { ...state } as ProfileModelState;
    // I think when changing profile, you should replace the axios token here too.
    // Replacing it here only changes the one in the tab opened.
    return {
      currentChosenUsername: action.payload,
      profiles: currentState.profiles,
    };
  },

  /**
   * [WIP] Set the current profiles
   * Useful for:
   * 1. Updating tokens
   * 2. Saving the new token to LocalStorage
   * 3. (Maybe) websocket related functions
   */

  /**
   * Replace the current profiles with the new `payload`
   * @param state 
   * @param action 
   * @returns 
   */
  [PROFILE_REDUCERS.SET_PROFILES](state, action) {
    const currentState = { ...state } as ProfileModelState;
    // Store it in LocalStorage with the key 'profile'
    // And type of [[username, token]]
    const localStorageProfiles: ProfileHashmap = action.payload; 
    localStorage.setItem(Model.PROFILE, JSON.stringify(localStorageProfiles));
    return {
      currentChosenUsername: currentState.currentChosenUsername,
      profiles: action.payload,
    };
  },

  /**
   * Add a new profile to the current profiles
   * @param state 
   * @param action 
   * @returns 
   */
  [PROFILE_REDUCERS.ADD_PROFILE](state, action) {
    const currentState = { ...state } as ProfileModelState;

    // Get current profiles in LocalStorage
    const currentProfilesInLocalStorage: ProfileHashmap =
      JSON.parse(localStorage.getItem(Model.PROFILE) || '{}');

    // Store it in LocalStorage with the key 'profile'
    currentProfilesInLocalStorage[action.payload.username] = {
      id: action.payload.id,
      username: action.payload.username,
      email: action.payload.email,
      token: action.payload.token,
    };
    localStorage.setItem(Model.PROFILE, JSON.stringify(currentProfilesInLocalStorage));
    return {
      currentChosenUsername: currentState.currentChosenUsername,
      profiles: currentProfilesInLocalStorage,
    };
  }
}

export { profileReducers }