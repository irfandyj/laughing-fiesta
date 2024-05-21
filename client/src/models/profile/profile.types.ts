import { UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';
import { Action, Reducer, } from 'umi';
import { EffectsCommandMap } from 'dva';
import { PROFILE_EFFECTS, PROFILE_REDUCERS } from './profile.constants';
import { Model } from '..';
import { AuthenticatedAxios } from "@/lib/axios";

/**
 * Saved profiles in LocalStorage
 * @example [['username', 'token'], ['username2', 'token2']]
 */
export type ProfileHashmapLocalStorage = {
  [username: string]: {
    id: string;
    username: string;
    email: string;
    token: string;
  }
};

export type Profile = {
  id: string;
  username: string;
  email: string;
  api: AuthenticatedAxios;
}
export type ProfileHashmap = {
  [username: string]: Profile
}

// State
export interface ProfileModelState {
  currentChosenUsername: string; // The username of the current chosen profile
  profiles: ProfileHashmap;
}

// Reducer Actions
export type ReducerProfileActionPayload = UserAuthenticationDto & Profile
export type ReducerProfileHHashmapActionPayload = {
  [username: string]: ReducerProfileActionPayload
} 

export interface SetChosenUsernameProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_INDEX_PROFILE;
  payload: string;
}
export interface SetProfileAction extends Action {
  type: PROFILE_REDUCERS.SET_PROFILES;
  payload: ReducerProfileHHashmapActionPayload;
}
export interface ReducerAddProfileAction extends Action {
  type: PROFILE_REDUCERS.ADD_PROFILE;
  payload: ReducerProfileActionPayload;
}

// Effect Actions
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