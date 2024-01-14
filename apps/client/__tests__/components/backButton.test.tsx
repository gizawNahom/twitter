import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderElement } from '../utilities';
import { BackButton } from '../../components/backButton';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const back = jest.fn();
const push = jest.fn();
const windowHistorySpy = jest.spyOn(global.globalThis.window, 'history', 'get');

const BACK_BUTTON = /back/i;

function renderSUT() {
  renderElement(<BackButton />);
}

function mockRouter() {
  const router = useRouter as jest.Mock;
  router.mockImplementation(() => ({
    back: back,
    push: push,
  }));
}

beforeEach(() => {
  mockRouter();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('returns to previous page by clicking back', async () => {
  // @ts-expect-error type not compatible
  windowHistorySpy.mockImplementation(() => [1, 2, 3]);
  renderSUT();

  await userEvent.click(screen.getByRole('button', { name: BACK_BUTTON }));

  expect(back).toHaveBeenCalledTimes(1);
});

test('returns to home if there is no history', async () => {
  // @ts-expect-error type not compatible
  windowHistorySpy.mockImplementation(() => [1]);
  renderSUT();

  await userEvent.click(screen.getByRole('button', { name: BACK_BUTTON }));

  expect(push).toHaveBeenCalledWith('/home');
});