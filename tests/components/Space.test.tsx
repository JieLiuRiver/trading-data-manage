import { render } from '@testing-library/react';
import Space from '@/components/Space';
import '@testing-library/jest-dom/extend-expect';

describe('Space', () => {
  it('Space component should render correctly with horizontal direction and size prop', () => {
    const { getByTestId } = render(<Space direction="horizontal" size={100} />);

    const space = getByTestId('space');
    expect(space).toHaveStyle({ width: '100px' });
  });
  it('Space component should render correctly with vertical direction and size prop', () => {
    const { getByTestId } = render(<Space direction="vertical" size={200} />);

    const space = getByTestId('space');
    expect(space).toHaveStyle({ height: '200px' });
  });
});
