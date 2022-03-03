import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'core/store';
import * as AuthActions from 'core/store/Auth.slice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const fetching = useSelector((state: RootState) => state.auth.fetching);

  const fetchUser = useCallback(
    (userId: number) => {
      return dispatch(AuthActions.fetchUser(userId)).unwrap();
    },
    [dispatch]
  );

  return {
    user,
    fetchUser,
    fetching,
  };
}
