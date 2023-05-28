import type { AppProps } from 'next/app';

import { CurrentAccountProvider } from '../context/CurrentAccountProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CurrentAccountProvider>
      <Component {...pageProps} />
    </CurrentAccountProvider>
  );
}

export default MyApp;
