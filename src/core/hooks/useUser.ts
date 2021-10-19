import { useState, useCallback } from 'react';

import { User, UserService } from 'alex-holanda-sdk';

export function useUser() {
  const [user, setUser] = useState<User.Detailed>();

  const fetchUser = useCallback((userId: number) => {
    UserService.getDetailedUser(userId).then(setUser);
  }, []);

  return {
    user,
    fetchUser,
  };
}
