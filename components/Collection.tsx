import { Image, Wrap, WrapItem } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { CHAIN_NAME, CONTRACT_ADDRESS } from "../constants/core";

type OriginResult = {
  amount: string;
  block_number_minted: string;
  contract_type: any;
  last_metadata_sync: string;
  last_token_uri_sync: any;
  metadata: string;
  name: string;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: string;
  token_uri: string;
};

type MoralisResponse = {
  cursor: string;
  page: number;
  page_size: number;
  result: Array<OriginResult>;
  total: number;
};

type TokenData = {
  tokenId: string;
  amount: string;
  metadata: {
    image: string;
    name: string;
    attributes: Array<any>;
  };
};

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || ""
  }
};

const Collection: React.FC = () => {
  const [cursor, setCursor] = useState<string>("");
  const [data, setData] = useState<Array<TokenData>>([]);

  const fetchMore = () => {
    fetch(`https://deep-index.moralis.io/api/v2/nft/${CONTRACT_ADDRESS}?chain=${CHAIN_NAME}&format=decimal&limit=12&cursor=${cursor}`, options)
      .then(res => res.json())
      .then((res: MoralisResponse) => {
        setCursor(res.cursor);

        const newData: typeof data = res.result.map(o => {
          const m = JSON.parse(o.metadata);
          return {
            tokenId: o.token_id,
            amount: o.amount,
            metadata: {
              image: m.image,
              name: m.name,
              attributes: m.attributes
            }
          };
        });

        setData(data.concat(newData));
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMore();
  }, []);

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMore}
      hasMore={cursor?.length > 0}
      loader={<h4>Loading...</h4>}
      style={{
        padding: 20
      }}
    >
      <Wrap px="1rem" spacing={4} justify="center">
        {data.map((o) => (
          <WrapItem
            key={o.tokenId}
            boxShadow="base"
            rounded="20px"
            overflow="hidden"
            bg="white"
            lineHeight="0"
            _hover={{ boxShadow: "dark-lg" }}
          >
            <Image
              src={o.metadata.image}
              height={200}
              width={200}
              alt={o.metadata.name}
            />
            <span>{o.tokenId}</span>
          </WrapItem>
        ))}
      </Wrap>
    </InfiniteScroll>
  );
};

export default Collection;