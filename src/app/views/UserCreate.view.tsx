import { usePageTitle } from '../../core/hooks/usePageTitle';
import UserForm from '../features/UserForm';

export default function UserCreateView() {
  usePageTitle('Cadastro do usuário');

  return (
    <>
      <UserForm />
    </>
  );
}
