/**
 * Models for managing multiple profiles
 */
import { Model } from '..';
import { PROFILE_REDUCERS, PROFILE_EFFECTS } from './profile.constants';
import { ProfileModelType, ReducerAddProfileAction, SetProfileAction } from './profile.types';
import { profileReducers } from './profile.reducers';
import { createAxios } from '@/lib/axios';

const ProfileModel: ProfileModelType = {
  namespace: Model.PROFILE,

  state: {
    currentChosenUsername: '',
    profiles: {},
  },

  // Getters
  // Get Current Profile

  // Reducers
  reducers: {
    [PROFILE_REDUCERS.SET_INDEX_PROFILE]: profileReducers[PROFILE_REDUCERS.SET_INDEX_PROFILE],
    [PROFILE_REDUCERS.SET_PROFILES]: profileReducers[PROFILE_REDUCERS.SET_PROFILES],
    [PROFILE_REDUCERS.ADD_PROFILE]: profileReducers[PROFILE_REDUCERS.ADD_PROFILE],
  },

  // Effects
  effects: {

    /**
     * Setup the current profile
     */
    *[PROFILE_EFFECTS.SETUP_PROFILES](action, effects) {
      const { put } = effects;
      const profiles = Object.keys(action.payload)
        .reduce((acc, username) => {
          acc[username] = {
            ...action.payload[username],
            rooms: [],
            api: createAxios(action.payload[username].token)
          };
          return acc;
        }, {} as SetProfileAction['payload']);
      yield put<SetProfileAction>({
        type: PROFILE_REDUCERS.SET_PROFILES,
        payload: profiles
      });

      // Set the first profile as the current profile
      const firstProfile = Object.keys(profiles)[0];
      yield put({
        type: PROFILE_REDUCERS.SET_INDEX_PROFILE,
        payload: firstProfile
      });
    },

    /**
     * Add a new profile to the current profiles
     * @param state 
     * @param action 
     * @returns 
     */
    *[PROFILE_EFFECTS.ADD_PROFILE](action, effects) {
      const { put } = effects;
      const profile = {
        ...action.payload,
        // Do this again later.
        // rooms: action.payload.rooms as string[],
        rooms: action.payload.rooms as any,
        api: createAxios(action.payload.token)
      };

      yield put<ReducerAddProfileAction>({
        type: PROFILE_REDUCERS.ADD_PROFILE,
        payload: profile
      });
      // Uses the latest index
      yield put({
        type: PROFILE_REDUCERS.SET_INDEX_PROFILE,
        payload: profile.username
      });
    },


  },


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
}

export default ProfileModel;