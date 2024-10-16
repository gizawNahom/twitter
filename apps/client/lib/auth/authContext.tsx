import { createContext, ReactNode, useContext, useState } from 'react';
import { GetLoggedInUserUseCase } from './getLoggedInUserUseCase';

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
  const useCase = new GetLoggedInUserUseCase();
  const [user] = useState<SignedInUser>(() => useCase.execute());

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
