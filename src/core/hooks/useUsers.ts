import { User } from 'alex-holanda-sdk';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import * as UserActions from '../store/User.reducer';

export function useUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list);
  const fetching = useSelector((state: RootState) => state.user.fetching);
  const editors = useSelector((state: RootState) =>
    state.user.list.filter((user) => user.role === 'EDITOR')
  );

  const fetchUsers = useCallback(() => {
    return dispatch(UserActions.getAllUsers()).unwrap();
  }, [dispatch]);

  const toggleUserStatus = useCallback(
    async (user: User.Detailed | User.Summary) => {
      await dispatch(UserActions.toggleUserStatus(user));
      dispatch(UserActions.getAllUsers());
    },
    [dispatch]
  );

  return { users, editors, fetching, fetchUsers, toggleUserStatus };
}
