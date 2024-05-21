import { Model } from '..';
import { ProfileModelType, ProfileModelState, ProfileHashmapLocalStorage } from './profile.types';
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
    // const localStorageProfiles: ProfileHashmapLocalStorage = action.payload; 
    const localStorageProfiles: ProfileHashmapLocalStorage = Object.keys(action.payload)
      .reduce((acc, key: string) => {
        acc[key] = {
          id: action.payload[key].id,
          username: action.payload[key].username,
          email: action.payload[key].email,
          token: action.payload[key].token,
        };
        return acc;
      }, {} as ProfileHashmapLocalStorage); 
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
    const profiles: ProfileHashmapLocalStorage =
      JSON.parse(localStorage.getItem(Model.PROFILE) || '{}');

    // Store it in LocalStorage with the key 'profile'
    profiles[action.payload.username] = {
      id: action.payload.id,
      username: action.payload.username,
      email: action.payload.email,
      token: action.payload.token,
    };
    localStorage.setItem(Model.PROFILE, JSON.stringify(profiles));

    // Update the current `profilesState` with the new profile
    const profilesState = Object.keys(currentState.profiles).reduce((acc, key: string) => {
      acc[key] = {
        ...currentState.profiles[key],
        api: action.payload.api,
      };
      return acc;
    }, {} as ProfileModelState['profiles']);
    profilesState[action.payload.username] = {
      ...action.payload,
      api: action.payload.api,
    };

    return {
      currentChosenUsername: currentState.currentChosenUsername,
      profiles: profilesState,
    };
  }
}

export { profileReducers }