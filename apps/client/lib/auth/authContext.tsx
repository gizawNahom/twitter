import { createContext, ReactNode, useContext, useState } from 'react';

const AuthContext = createContext<{ user: SignedInUser | null }>({
  user: null,
});

interface SignedInUser {
  id: string;
}

export function useAuth(): { user: SignedInUser | null } {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<SignedInUser>({
    id: 'senderId',
  });

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
