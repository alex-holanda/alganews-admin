import { User } from 'alex-holanda-sdk';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import * as UserActions from '../store/User.reducer';

export function useUsers() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.user.list);
  const fetching = useSelector((state: RootState) => state.user.fetching);

  const fetchUsers = useCallback(() => {
    dispatch(UserActions.getAllUsers());
  }, [dispatch]);

  const toggleUserStatus = useCallback(
    (user: User.Detailed | User.Summary) => {
      dispatch(UserActions.toggleUserStatus(user));
    },
    [dispatch]
  );

  return { users, fetching, fetchUsers, toggleUserStatus };
}
