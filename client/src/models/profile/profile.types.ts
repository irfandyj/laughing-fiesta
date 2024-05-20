import { UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';
import { Action, Reducer, } from 'umi';
import { EffectsCommandMap } from 'dva';
import { PROFILE_EFFECTS, PROFILE_REDUCERS } from './profile.constants';
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

// Reducers Actions
export interface SetIndexProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_INDEX_PROFILE;
  payload: number;
}
export interface SetProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_PROFILES;
  payload: UserAuthenticationDto[];
}
export interface ReducerAddProfileAction extends Action {
  type: PROFILE_REDUCERS.ADD_PROFILE;
  payload: UserAuthenticationDto;
}

// Effects Actions
export interface AddProfileAction extends Action {
  type: PROFILE_EFFECTS.ADD_PROFILE;
  payload: UserAuthenticationDto;
}
export type AddProfileEffect = (action: AddProfileAction, effects: EffectsCommandMap) => void;

// Model
export interface ProfileModelType {
  namespace: Model.PROFILE;
  state: ProfileModelState;
  reducers: {
    [PROFILE_REDUCERS.SET_INDEX_PROFILE]: Reducer<ProfileModelState, SetIndexProfileAction>;
    [PROFILE_REDUCERS.SET_PROFILES]: Reducer<ProfileModelState, SetProfileAction>,
    [PROFILE_REDUCERS.ADD_PROFILE]: Reducer<ProfileModelState, ReducerAddProfileAction>,
    //   queryUserSuccess: ImmerReducer<ProfileModelState>;
  };
  effects: {
    [PROFILE_EFFECTS.ADD_PROFILE]: AddProfileEffect,
    //   queryUser: Effect;
  };
  // subscriptions: { setup: Subscription };
}