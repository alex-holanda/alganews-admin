import { useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';

import { notification, Skeleton, Card } from 'antd';

import moment from 'moment';

import { User, UserService } from 'alex-holanda-sdk';

import { useUser } from '../../core/hooks/useUser';

import UserForm from '../features/UserForm';
import { NotFoundError } from '../components/NotFoundError';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { useBreadcrumb } from 'core/hooks/useBreadcrumb';

export default function UserEditView() {
  usePageTitle('Edição de usuário');

  useBreadcrumb('Usuários/Edição');

  const params = useParams<{ id: string }>();
  const { user, fetchUser, notFound } = useUser();

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

  async function handleUserUpdate(user: User.Input) {
    await UserService.updateExistingUser(Number(params.id), user).then(() => {
      notification.success({ message: 'Usuário atualizado' });
    });
  }

  if (isNaN(Number(params.id))) {
    return <Redirect to={'/usuarios'} />;
  }

  if (notFound) {
    return (
      <Card>
        <NotFoundError
          title={'Usuário não encontrado'}
          actionDestination={'/usuarios'}
          actionTitle={'Voltar para a lista de usuários'}
        />
      </Card>
    );
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
