/**
 * Models for managing multiple profiles
 */
import { Model } from '..';
import { PROFILE_REDUCERS } from './profile.constants';
import { ProfileModelType, ProfileModelState } from './profile.types';

const ProfileModel: ProfileModelType = {
  namespace: Model.PROFILE,

  state: {
    currentChosenIndexProfile: 0,
    profiles: [],
  },

  // Getters

  // Reducers
  reducers: {
    [PROFILE_REDUCERS.SET_INDEX_PROFILE](state, action) {
      const currentState = { ...state } as ProfileModelState;
      return {
        currentChosenIndexProfile: action.payload,
        profiles: currentState.profiles,
      };
    },
    [PROFILE_REDUCERS.ADD_PROFILE](state, action) {
      const currentState = { ...state } as ProfileModelState;
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