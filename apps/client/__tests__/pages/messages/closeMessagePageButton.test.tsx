import { CloseMessagePageButton } from '../../../pages/messages/compose';
import {
  clickElement,
  getByRole,
  renderElement,
  setUpMockRouter,
} from '../../testUtilities';

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

  expect(push).toHaveBeenCalledWith('/messages');
});
