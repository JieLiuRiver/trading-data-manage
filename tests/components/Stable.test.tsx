import React from 'react';
import { render } from '@testing-library/react';
import StableIcon from '@/components/SvgIcons/Stable';

describe('StableIcon', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<StableIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render correctly with size and color props', () => {
    const { container } = render(<StableIcon size={48} color="gray" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
