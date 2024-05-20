import { api } from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { Endpoints as ApiEndpoints } from 'gigradar-commons/build/constants/endpoints';
import { SignUpDto, UserAuthenticationDto } from 'gigradar-commons/build/dtos/authentication';

type SignUpResponse = AxiosResponse<UserAuthenticationDto>;
export async function signUp(signupData: SignUpDto) {
  return await api.post<UserAuthenticationDto, SignUpResponse, SignUpDto>
    (ApiEndpoints.SIGN_UP, signupData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
}

export async function signUpFormFlow(data: SignUpDto) {
  try {
    const signUpRes = await signUp(data);
    console.log(signUpRes.data);

    // Successfuly sign up
    // Use the JWT for the axios
    // Connect to a websocket
  } catch (e) {
    console.error(e);
  }
}
