import { Username } from './username';

export class User {
  constructor(
    private id: string,
    private username: Username,
    private displayName: string,
    private profilePic: string
  ) {}

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username.getUsername();
  }

  getDisplayName() {
    return this.displayName;
  }

  getProfilePic() {
    return this.profilePic;
  }
}
