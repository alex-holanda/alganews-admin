import { User, UserService } from 'alex-holanda-sdk';
import { useCallback, useState } from 'react';

export function useUsers() {
  const [users, setUsers] = useState<User.Summary[]>([]);

  const fetchUsers = useCallback(() => {
    UserService.getAllUsers({}).then(setUsers);
  }, []);

  return { users, fetchUsers };
}
