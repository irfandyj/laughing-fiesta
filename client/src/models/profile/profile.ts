/**
 * Models for managing multiple profiles
 */
import { Model } from '..';
import { PROFILE_REDUCERS, PROFILE_EFFECTS } from './profile.constants';
import { ProfileModelType } from './profile.types';
import { profileReducers } from './profile.reducers';


const ProfileModel: ProfileModelType = {
  namespace: Model.PROFILE,

  state: {
    currentChosenIndexProfile: 0,
    profiles: [],
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
     * Add a new profile to the current profiles
     * @param state 
     * @param action 
     * @returns 
     */
    *[PROFILE_EFFECTS.ADD_PROFILE](action, effects) {
      const { put } = effects;

      // const currentState = { ...state } as ProfileModelState;

      // this.reducers[PROFILE_REDUCERS.SET_PROFILES](
      //   currentState,
      //   {
      //     type: PROFILE_REDUCERS.SET_PROFILES,
      //     payload: [...currentState.profiles, action.payload]
      //   }
      // );
      // return {
      //   currentChosenIndexProfile: currentState.currentChosenIndexProfile,
      //   profiles: [...currentState.profiles, action.payload],
      // };
    },
    // addProfile({ payload }, { call, put }) {
    //   yield put({ type: 'addProfile', payload });
    // }
    //   *queryUser({ payload }, { call, put }) {
    //     const { data } = yield call(queryUser, payload);
    //     yield put({ type: 'queryUserSuccess', payload: data });
    //   },
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