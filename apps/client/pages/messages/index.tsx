import Link from 'next/link';
import { Page } from '../../components/page';
import { MESSAGES_COMPOSE_ROUTE } from '../../utilities/constants';

export default function Messages() {
  return (
    <Page header={<div className="text-center">Messages</div>}>
      <div>
        <ComposeMessageFAB />
      </div>
    </Page>
  );
}

export function ComposeMessageFAB() {
  return (
    <Link
      data-testid="compose-message-FAB"
      href={MESSAGES_COMPOSE_ROUTE}
      aria-label="Compose Message"
    ></Link>
  );
}
