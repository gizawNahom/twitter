import { ReduxState } from '../../../redux/store';

export const selectSelectedUser = (state: ReduxState) =>
  state.messages.selectedUser;
