import { Box, Button, HStack, Heading, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Layout = function ({ children }: { children: React.ReactNode; }) {
  const [isSSR, setIsSSR] = useState(true);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <Box>
      <HStack
        paddingX="8"
        paddingY="4"
        backgroundColor={"gray.700"}
        display="flex"
        justifyContent="space-between"
      >
        <Heading color={"white"}>CryptoPunk</Heading>
        {!isSSR && isConnected ? (
          <Button
            onClick={() => {
              disconnect();
            }}
          >
            {address?.toString().slice(0, -36)}...
            {address?.toString().substring(38)}
          </Button>
        ) : (
          <Button
            onClick={() => {
              connect();
            }}
          >
            Connect Metamask
          </Button>
        )}
      </HStack>
      {children}
      <HStack
        paddingX="8"
        paddingY="4"
        backgroundColor={"gray.700"}
        display="flex"
        justifyContent="center"
      >
        <Text color={"white"}>
          Footer
        </Text>
      </HStack>
    </Box>
  );
};

export default Layout;
