import { UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';
import { Action, Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import { PROFILE_REDUCERS } from './profile.constants';
import { Model } from '..';

export interface ProfileModelState {
  currentChosenIndexProfile: number;
  profiles: UserAuthenticationDto[];
}

export enum ProfileActionTypes {
  SET_INDEX_PROFILE = 'SET_INDEX_PROFILE',
  ADD_PROFILE = 'ADD_PROFILE',
}
export interface SetIndexProfileAction extends Action {
  type: ProfileActionTypes.SET_INDEX_PROFILE;
  payload: number;
}
export interface AddProfileAction extends Action {
  type: ProfileActionTypes.ADD_PROFILE;
  payload: UserAuthenticationDto;
}

export interface ProfileModelType {
  namespace: Model.PROFILE;
  state: ProfileModelState;
  reducers: {
    [PROFILE_REDUCERS.SET_INDEX_PROFILE]: Reducer<ProfileModelState, SetIndexProfileAction>;
    [PROFILE_REDUCERS.ADD_PROFILE]: Reducer<ProfileModelState, AddProfileAction>,
    //   queryUserSuccess: ImmerReducer<ProfileModelState>;
  };
  // effects: {
  //   queryUser: Effect;
  // };
  // subscriptions: { setup: Subscription };
}