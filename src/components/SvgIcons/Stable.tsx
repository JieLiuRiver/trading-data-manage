import { memo } from 'react';

const StableIcon = memo<{
  size?: number;
  color?: string;
}>(({ size = 24, color }) => {
  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="9429"
      width={size}
      height={size}
      fill={color}
    >
      <path d="M63.6 489.6h896.7v44.8H63.6z" p-id="9430"></path>
    </svg>
  );
});

export default StableIcon;
