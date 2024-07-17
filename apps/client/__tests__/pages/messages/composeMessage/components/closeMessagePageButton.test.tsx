import { CloseMessagePageButton } from '../../../../../lib/messages/presentation/pages/composeMessage';
import {
  clickElement,
  getByRole,
  renderElement,
  setUpMockRouter,
} from '../../../../testUtilities';
import { MESSAGES } from '../../../../testUtilities/routes';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();

setUpMockRouter({ push });

function renderSUT() {
  renderElement(<CloseMessagePageButton />);
}

function getCloseButton(): HTMLElement {
  return getByRole('button', { name: /close/i });
}

test('initial', () => {
  renderSUT();

  expect(getCloseButton()).toBeInTheDocument();
});

test('closes message page', async () => {
  renderSUT();

  await clickElement(getCloseButton());

  expect(push).toHaveBeenCalledWith(MESSAGES);
});
