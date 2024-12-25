export interface Chat {
  id: string;
  createdAtISO: string;
  participant: {
    username: string;
    displayName: string;
    profilePic: string;
  };
  __typename?: string;
}
