import { memo } from 'react';
interface SpaceProps {
  direction: 'vertical' | 'horizontal';
  size: number;
}

const Space = memo<SpaceProps>(({ direction, size }) => {
  const sizeProps: React.CSSProperties =
    direction === 'vertical' ? { height: size } : { width: size };

  return (
    <>
      <div data-testid="space" style={sizeProps} />
    </>
  );
});

export default Space;
