import { useRouter } from 'next/router';
import Messages from '../../lib/messages/ui/pages/messages';

export default function Page() {
  const router = useRouter();
  const chatId = router.query.id;

  return <Messages chatId={getChatId(chatId)} />;

  function getChatId(
    chatId: string[] | string | undefined
  ): string | undefined {
    return Array.isArray(chatId) ? chatId[0] : chatId;
  }
}
