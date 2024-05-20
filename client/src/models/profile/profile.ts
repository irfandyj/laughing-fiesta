/**
 * Models for managing multiple profiles
 */
import { Model } from '..';
import { PROFILE_REDUCERS } from './profile.constants';
import { ProfileModelType, ProfileModelState, SavedProfilesInLocalStorage } from './profile.types';

const ProfileModel: ProfileModelType = {
  namespace: Model.PROFILE,

  state: {
    currentChosenIndexProfile: 0,
    profiles: [],
  },

  // Getters

  // Reducers
  reducers: {

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

      this[PROFILE_REDUCERS.SET_PROFILES](
        currentState,
        {
          type: PROFILE_REDUCERS.SET_PROFILES,
          payload: [...currentState.profiles, action.payload]
        }
      );
      return {
        currentChosenIndexProfile: currentState.currentChosenIndexProfile,
        profiles: [...currentState.profiles, action.payload],
      };
    },

    // Effects
    // effects: {
    // addProfile({ payload }, { call, put }) {
    //   yield put({ type: 'addProfile', payload });
    // }
    //   *queryUser({ payload }, { call, put }) {
    //     const { data } = yield call(queryUser, payload);
    //     yield put({ type: 'queryUserSuccess', payload: data });
    //   },
    // },


    // subscriptions: {
    //   setup({ dispatch, history }) {
    //     return history.listen(({ pathname }) => {
    //       if (pathname === '/profile') {
    //         dispatch({
    //           type: 'queryUser',
    //         });
    //       }
    //     });
    //   },
  },
};

export default ProfileModel;