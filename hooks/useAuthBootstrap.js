import { loadToken } from '@/features/auth/authSlice';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export const useAuthBootstrap = () => {
  const dispatch = useDispatch();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) return;

    hasBootstrapped.current = true;
    dispatch(loadToken());
  }, [dispatch]);
};
