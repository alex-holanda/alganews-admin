import { useCallback, useEffect } from 'react';

import { Skeleton } from 'antd';

import moment from 'moment';

import { User } from 'alex-holanda-sdk';

import { useUser } from '../../core/hooks/useUser';

import UserForm from '../features/UserForm';

export default function UserEditView() {
  const { user, fetchUser } = useUser();

  useEffect(() => {
    fetchUser(1);
  }, [fetchUser]);

  const transformUserData = useCallback((user: User.Detailed) => {
    return {
      ...user,
      createdAt: moment(user.createdAt),
      updatedAt: moment(user.updatedAt),
      birthdate: moment(user.birthdate),
    };
  }, []);

  if (!user) {
    return <Skeleton />;
  }

  return (
    <>
      <UserForm user={transformUserData(user)} />
    </>
  );
}
