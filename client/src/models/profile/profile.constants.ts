import { Model } from "..";

export enum PROFILE_GETTERS {
  CURRENT_PROFILE = 'getCurrentProfile',
}

export enum PROFILE_REDUCERS {
  SET_INDEX_PROFILE = 'setIndexProfile',
  ADD_PROFILE = 'addProfile',
}

export enum PROFILE_EFFECTS {
}

export enum PROFILE_ACTIONS {
  SET_INDEX_PROFILE = `${Model.PROFILE}/${PROFILE_REDUCERS.SET_INDEX_PROFILE}`,
  ADD_PROFILE = `${Model.PROFILE}/${PROFILE_REDUCERS.ADD_PROFILE}`
}