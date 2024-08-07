import { screen, waitFor } from '@testing-library/react';
import { Modal } from '../../components/modal';
import { getByText, clickElement, renderElement } from '../testUtilities';

test('gets closed', async () => {
  const testText = 'Test';
  renderElement(<Modal>{testText}</Modal>);

  await clickElement(screen.getByLabelText(/close/i));

  await waitFor(() => expect(getByText(testText)).not.toBeVisible());
});
