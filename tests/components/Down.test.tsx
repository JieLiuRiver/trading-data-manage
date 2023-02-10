import React from 'react';
import { render } from '@testing-library/react';
import DownIcon from '@/components/SvgIcons/Down';

describe('DownIcon', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<DownIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render correctly with size and color props', () => {
    const { container } = render(<DownIcon size={48} color="red" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
