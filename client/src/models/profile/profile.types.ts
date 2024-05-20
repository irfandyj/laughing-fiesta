import { UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';
import { Action, Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import { PROFILE_REDUCERS } from './profile.constants';
import { Model } from '..';

/**
 * Saved profiles in LocalStorage
 * @example [['username', 'token'], ['username2', 'token2']]
 */
export type SavedProfilesInLocalStorage = [string, string][];

export interface ProfileModelState {
  currentChosenIndexProfile: number;
  profiles: UserAuthenticationDto[];
}

export interface SetIndexProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_INDEX_PROFILE;
  payload: number;
}
export interface SetProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_PROFILES;
  payload: UserAuthenticationDto[];
}
export interface AddProfileAction extends Action {
  type: PROFILE_REDUCERS.ADD_PROFILE;
  payload: UserAuthenticationDto;
}

export interface ProfileModelType {
  namespace: Model.PROFILE;
  state: ProfileModelState;
  reducers: {
    [PROFILE_REDUCERS.SET_INDEX_PROFILE]: Reducer<ProfileModelState, SetIndexProfileAction>;
    [PROFILE_REDUCERS.SET_PROFILES]: Reducer<ProfileModelState, SetProfileAction>,
    [PROFILE_REDUCERS.ADD_PROFILE]: Reducer<ProfileModelState, AddProfileAction>,
    //   queryUserSuccess: ImmerReducer<ProfileModelState>;
  };
  // effects: {
  //   queryUser: Effect;
  // };
  // subscriptions: { setup: Subscription };
}