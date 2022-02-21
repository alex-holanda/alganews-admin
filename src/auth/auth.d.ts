import { User } from 'alex-holanda-sdk';

declare namespace Authentication {

  export type OAuthAuthorizationTokenResponse = {
    access_token: string;
    refresh_token: 'string';
    token_type: 'bearer' | string;
    expires_in: number;
    scope: string;
    [key: string]: string | number;
  }

  export type AccessTokenDecodedBody = {
    'alganews:user_full_name': string;
    'alganews:user_id': number;
    user_name: string;
    scope: string[];
    exp: number;
    authorities: User.Role[];
    jti: string;
    client_id: string;
  };
}
