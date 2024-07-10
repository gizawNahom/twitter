import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../../../utilities/getUsers';

const initialState: MessagesSliceState = {
  selectedUser: null,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    userSelected: (state, { payload }: { payload: User }) => {
      state.selectedUser = payload;
    },
  },
});

export const { userSelected } = messagesSlice.actions;

export interface MessagesSliceState {
  selectedUser: User | null;
}
