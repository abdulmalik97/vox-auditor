"use client";

import React, {
  createContext,
  PropsWithChildren,
  useState,
} from "react";

export interface Account {
  practice: {
    practiceId: string;
    practiceName: string;
    locations: {
      [locationId: string]: {
        providers: string[];
        facilityName: string;
      };
    };
  };
}

/**
 * Context regarding the current account/practice state.
 */
export interface AccountContext {
  currentAccount: undefined | Account;

  setAccount: (user: Account | undefined) => void;
}

const Context = createContext<AccountContext>({
  currentAccount: undefined,
  setAccount: () => undefined,
});

type PracticeContextProps = PropsWithChildren;

/**
 * The context provider for the {@link Context} instance.
 */
const AccountProvider: React.FC<PracticeContextProps> = ({
  children,
}: PracticeContextProps) => {
  const [currentAccount, setAccount] = useState<undefined | Account>();

  return (
    <Context.Provider value={{ currentAccount, setAccount }}>
      {children}
    </Context.Provider>
  );
};

export { Context, AccountProvider };
