import React from 'react';
import { render } from '@testing-library/react';
import UpIcon from '@/components/SvgIcons/Up';

describe('UpIcon', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<UpIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render correctly with size and color props', () => {
    const { container } = render(<UpIcon size={48} color="red" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
