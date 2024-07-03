import Link from 'next/link';
import { Page } from '../../components/page';
import { MESSAGES_COMPOSE_ROUTE } from '../../utilities/constants';
import { FAB } from '../../components/fab';

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
    >
      <FAB>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className=" w-6 h-6 stroke-white fill-white stroke-0"
        >
          <g>
            <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
          </g>
        </svg>
      </FAB>
    </Link>
  );
}
