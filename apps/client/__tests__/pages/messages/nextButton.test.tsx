import { getByRole, renderElement } from '../../testUtilities';
import { NextButton } from '../../../pages/messages/compose';

export function getNextButton(): HTMLElement {
  return getByRole('button', { name: /next/i });
}

export function assertNextButtonIsDisabled() {
  expect(getNextButton()).toBeDisabled();
}

export function assertNextButtonIsNotDisabled() {
  expect(getNextButton()).not.toBeDisabled();
}

test('exists', () => {
  renderElement(<NextButton isDisabled />);
});
