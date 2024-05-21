import { UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';
import { Action, Reducer, } from 'umi';
import { EffectsCommandMap } from 'dva';
import { PROFILE_EFFECTS, PROFILE_REDUCERS } from './profile.constants';
import { Model } from '..';

/**
 * Saved profiles in LocalStorage
 * @example [['username', 'token'], ['username2', 'token2']]
 */
export type ProfileHashmap = {
  [username: string]: {
    id: string;
    username: string;
    email: string;
    token: string;
  }
};

export interface ProfileModelState {
  currentChosenUsername: string; // The username of the current chosen profile
  profiles: ProfileHashmap;
}

// Reducers Actions
export interface SetChosenUsernameProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_INDEX_PROFILE;
  payload: string;
}
export type SetProfileActionPayload = {
  [username: string]: UserAuthenticationDto
}
export interface SetProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_PROFILES;
  payload: SetProfileActionPayload;
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
    [PROFILE_REDUCERS.SET_INDEX_PROFILE]: Reducer<ProfileModelState, SetChosenUsernameProfileAction>;
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