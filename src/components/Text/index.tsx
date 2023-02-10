import { memo, useRef } from 'react';
import { message, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { formatNum } from '@/utils/format';

type TextProps = {
  value?: string | number;
  copyable?: boolean;
  isTime?: boolean;
  isNum?: boolean;
  format?: string;
  tooltip?: boolean;
  linkStyle?: boolean;
  onClick?: () => void;
  ellipsis?: boolean;
  prefixText?: string;
};

export default memo<TextProps>(function Text({
  value,
  copyable = false,
  format = 'YYYY-MM-DD HH:mm',
  isTime = false,
  tooltip = true,
  isNum = false,
  linkStyle = false,
  ellipsis = true,
  onClick,
  prefixText,
}) {
  const copyNoderef = useRef<HTMLSpanElement | null>(null);
  if (typeof value === 'undefined') return null;
  const Component = linkStyle ? Typography.Link : Typography.Text;
  const realText = isTime
    ? moment(Number(value)).format(format)
    : isNum
    ? formatNum(String(value))
    : value;
  const content = (
    <Component
      onClick={onClick}
      ellipsis={ellipsis}
      style={{ color: 'inherit' }}
    >
      {prefixText} {realText || '-'}
    </Component>
  );
  if (!tooltip) {
    return content;
  }
  return (
    <Tooltip title={copyable ? '点击复制' : realText}>
      {copyable ? (
        <span
          ref={copyNoderef}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (!copyNoderef.current) {
              return;
            }
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(copyNoderef.current);
            selection?.removeAllRanges();
            selection?.addRange(range);
            selection?.toString();
            const result = document.execCommand('copy');
            message[result ? 'success' : 'error'](
              `复制${result ? '成功' : '失败'}`,
            );
          }}
        >
          {content}
        </span>
      ) : (
        content
      )}
    </Tooltip>
  );
});
