import { useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';

import { notification, Skeleton } from 'antd';

import moment from 'moment';

import { User, UserService } from 'alex-holanda-sdk';

import { useUser } from '../../core/hooks/useUser';

import UserForm from '../features/UserForm';

export default function UserEditView() {
  const params = useParams<{ id: string }>();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchUser(Number(params.id));
    }
  }, [fetchUser, params]);

  const transformUserData = useCallback((user: User.Detailed) => {
    return {
      ...user,
      createdAt: moment(user.createdAt),
      updatedAt: moment(user.updatedAt),
      birthdate: moment(user.birthdate),
    };
  }, []);

  function handleUserUpdate(user: User.Input) {
    UserService.updateExistingUser(Number(params.id), user).then(() => {
      notification.success({ message: 'Usuário atualizado' });
    });
  }

  if (isNaN(Number(params.id))) {
    return <Redirect to={'/usuarios'} />;
  }

  if (!user) {
    return <Skeleton />;
  }

  return (
    <>
      <UserForm user={transformUserData(user)} onUpdate={handleUserUpdate} />
    </>
  );
}
