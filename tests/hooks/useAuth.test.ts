import useAuth from '@/hooks/useAuth';
import { renderHook } from '@testing-library/react';

describe('useAuth', () => {
  it('should return the correct isLogin state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLogin).toBe(Boolean(''));
  });
});
