/**
 * Models for managing multiple profiles
 */
import { Model } from '..';
import { PROFILE_REDUCERS, PROFILE_EFFECTS } from './profile.constants';
import { ProfileModelType, ReducerAddProfileAction } from './profile.types';
import { profileReducers } from './profile.reducers';

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
     * Add a new profile to the current profiles
     * @param state 
     * @param action 
     * @returns 
     */
    *[PROFILE_EFFECTS.ADD_PROFILE](action, effects) {
      console.log(PROFILE_EFFECTS.ADD_PROFILE)
      console.log(action, effects)
      const { select, put } = effects;
      yield put<ReducerAddProfileAction>({
        type: PROFILE_REDUCERS.ADD_PROFILE,
        payload: action.payload
      });
      // Uses the latest index
      yield put({
        type: PROFILE_REDUCERS.SET_INDEX_PROFILE,
        payload: action.payload.username
      });

      // this.reducers[PROFILE_REDUCERS.SET_PROFILES](
      //   currentState,
      //   {
      //     type: PROFILE_REDUCERS.SET_PROFILES,
      //     payload: [...currentState.profiles, action.payload]
      //   }
      // );
      // return {
      //   currentChosenUsername: currentState.currentChosenUsername,
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