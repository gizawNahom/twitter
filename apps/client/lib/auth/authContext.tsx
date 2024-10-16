import { createContext, ReactNode, useContext, useState } from 'react';
import { DI } from './DI';

const AuthContext = createContext<{ user: SignedInUser | null }>({
  user: null,
});

export interface SignedInUser {
  id: string;
}

export function useAuth(): { user: SignedInUser | null } {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<SignedInUser>(() =>
    DI.getLoggedInUserUseCase.execute()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
