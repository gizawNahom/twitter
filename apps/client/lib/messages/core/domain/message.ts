export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  text: string;
  createdAt: string;
  isLoading?: boolean;
  __typename: string;
}
