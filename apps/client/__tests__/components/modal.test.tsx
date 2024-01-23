import { screen, waitFor } from '@testing-library/react';
import { Modal } from '../../components/modal';
import { renderElement } from '../utilities/helpers';
import userEvent from '@testing-library/user-event';

test('gets closed', async () => {
  const testText = 'Test';
  renderElement(<Modal>{testText}</Modal>);

  await userEvent.click(screen.getByLabelText(/close/i));

  await waitFor(() => expect(screen.getByText(testText)).not.toBeVisible());
});
