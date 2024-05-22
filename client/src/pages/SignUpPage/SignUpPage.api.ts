import { api, replaceAuthorizationHeader } from '@/lib/axios';
import { PROFILE_ACTIONS } from '@/models/profile/profile.constants';
import { AxiosResponse } from 'axios';
import { Endpoints as ApiEndpoints } from '@gigradar/commons/build/constants/endpoints';
import { SignUpDto, UserAuthenticationDto } from '@gigradar/commons/build/dtos/authentication';
import { getDvaApp } from 'umi';

type SignUpResponse = AxiosResponse<UserAuthenticationDto>;
export async function signUp(signupData: SignUpDto) {
  return await api.post<UserAuthenticationDto, SignUpResponse, SignUpDto>
    (ApiEndpoints.SIGN_UP, signupData, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
}

export async function signUpFormFlow(data: SignUpDto) {
  try {
    const signUpRes = await signUp(data);
    
    // Successfuly sign up
    // Use the JWT for the axios
    replaceAuthorizationHeader(signUpRes.data.token);

    // Set personal data in app state
    getDvaApp()._store.dispatch({
      type: PROFILE_ACTIONS.ADD_PROFILE,
      payload: signUpRes.data
    });
    
    // Connect to a websocket
    // Do websocket flow

    // Return all necessary data
    return signUpRes
  } catch (e) {
    console.error(e);
  }
}
