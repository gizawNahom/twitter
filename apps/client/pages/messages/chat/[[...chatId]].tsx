import Chat from '../../../lib/messages/ui/pages/chat';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const chatIdString = router.query.chatId;

  return <Chat chatId={extractChatId(chatIdString)} />;

  function extractChatId(
    chatId: string[] | string | undefined
  ): string | undefined {
    return Array.isArray(chatId) ? chatId[0] : chatId;
  }
}
