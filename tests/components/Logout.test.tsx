import { render } from '@testing-library/react';
import Logout from '@/components/logout';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

describe('Logout component', () => {
  it('renders correctly', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>,
    );
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
