import { ReduxState } from '../../store';

export const selectSelectedUser = (state: ReduxState) =>
  state.messages.selectedUser;
