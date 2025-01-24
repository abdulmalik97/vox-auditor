"use client"

import { AccountApi } from "@/features/app/auth/api";
import { AuthUser } from "@supabase/supabase-js";
import React, {
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";

export interface Account {
  practice: {
    practiceId: string;
    practiceName: string;
    locations: {
      [locationId: string]: {
        providers: string[];
      };
    };
  };
}

/**
 * Context regarding the auth and user state.
 */
export interface AccountContext {
  currentAccount: undefined | Account;

  setAccount: (user: Account | undefined) => void;

  // Auth user data
  // -------------------------

  authUser: undefined | AuthUser;

  setAuthUser: (user: AuthUser) => void;
}

const Context = createContext<AccountContext>({
  currentAccount: undefined,
  // Set this to be a no-op just to avoid constant undefined checks
  setAccount: () => undefined,

  authUser: undefined,
  // Set this to be a no-op just to avoid constant undefined checks
  setAuthUser: () => undefined,
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PracticeContextDefinition {}

type PracticeContextProps = PropsWithChildren<PracticeContextDefinition>;

/**
 * The context provider for the {@link Context} instance.
 */
const AccountProvider: React.FC<PracticeContextProps> = ({
  children,
}: PracticeContextProps) => {
  const [currentAccount, setAccount] = useState<undefined | Account>();
  const [authUser, setAuthUser] = useState<undefined | AuthUser>();
  const authUserCache = useRef(authUser);

  useEffect(() => {
    // This indicates that the user has logged out and any existing
    // user state should be cleared
    if (authUserCache.current?.id && !authUser?.id) {
      setAccount(undefined);
    } else if (authUser?.id && authUser?.email) {
      AccountApi.getAccount(authUser.email).then((account) => {
        setAccount(account);
      });
    }

    authUserCache.current = authUser;
  }, [authUser]);

  return (
    <Context.Provider
      value={{ currentAccount, setAccount, authUser, setAuthUser }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, AccountProvider };
