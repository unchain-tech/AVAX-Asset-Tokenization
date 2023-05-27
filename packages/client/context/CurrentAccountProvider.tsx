import { createContext, ReactNode } from 'react';

import { useWallet } from '../hooks/useWallet';

const CurrentAccountContext = createContext<[string | undefined, () => void]>([
  '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

export const CurrentAccountProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentAccount, connectWallet } = useWallet();

  return (
    <CurrentAccountContext.Provider value={[currentAccount, connectWallet]}>
      {children}
    </CurrentAccountContext.Provider>
  );
};

export default CurrentAccountContext;
