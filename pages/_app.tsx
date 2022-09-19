import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import Layout from "../components/Layout";
import "../styles/globals.css";

const { provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
        </QueryClientProvider>;
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default MyApp;
