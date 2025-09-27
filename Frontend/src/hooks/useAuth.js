import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/slices/authSlice';
import { getCurrentUser } from '../store/actions/auth.actions';
import { useEffect } from 'react';

export function useAuth() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,    
    refetchOnWindowFocus: false,
  });

  // handle side effects in useEffect
  useEffect(() => {
    if (query.isSuccess) {
      if (query.data?.user) {
        dispatch(login(query.data.user));
      } else {
        dispatch(logout());
      }
    }
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.isError) {
      console.error("Auth check failed:", query.error);
      dispatch(logout());
    }
  }, [query.isError, query.error, dispatch]);

  

  return query;
}
