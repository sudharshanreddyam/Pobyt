export class GoogleUserModel {
  image: string;
  email: string;
  displayName: string;
  userId: string;
  familyName: string;
  givenName: string;  
  friends: Array<string> = [];
  photos: Array<string> = [];
}
