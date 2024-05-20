import { Model } from '..';
import { ProfileModelType, ProfileModelState, SavedProfilesInLocalStorage } from './profile.types';
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
      currentChosenIndexProfile: action.payload,
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
    const localStorageProfiles: SavedProfilesInLocalStorage = action.payload.map((profile) => [profile.username, profile.token]);
    localStorage.setItem(Model.PROFILE, JSON.stringify(localStorageProfiles));
    return {
      currentChosenIndexProfile: currentState.currentChosenIndexProfile,
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
    // Store it in LocalStorage with the key 'profile'
    // And type of [[username, token]]
    const localStorageProfiles: SavedProfilesInLocalStorage = [
      ...currentState.profiles,
      action.payload
    ].map((profile) => [profile.username, profile.token]);
    localStorage.setItem(Model.PROFILE, JSON.stringify(localStorageProfiles));
    return {
      currentChosenIndexProfile: currentState.currentChosenIndexProfile,
      profiles: [...currentState.profiles, action.payload],
    };
  }
}

export { profileReducers }