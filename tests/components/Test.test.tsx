import { render } from '@testing-library/react';
// import { Typography } from 'antd';
import moment from 'moment';
import Text from '@/components/Text';

describe('Text component test', () => {
  it('should display text correctly', () => {
    const { getByText } = render(<Text value="text" />);
    expect(getByText('text')).toBeTruthy();
  });
  it('should format number correctly', () => {
    const { getByText } = render(<Text value={1000} isNum={true} />);
    expect(getByText('1,000')).toBeTruthy();
  });
  it('should format time correctly', () => {
    const value = Date.now();
    const { getByText } = render(<Text value={value} isTime={true} />);
    const time = moment(value).format('YYYY-MM-DD HH:mm');
    expect(getByText(time)).toBeTruthy();
  });
});
