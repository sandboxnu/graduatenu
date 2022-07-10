import { getGlobalDispatcher, Pool, setGlobalDispatcher } from "undici";
import { BASE_URL } from "../constants";

/**
 * The scrapers (by default) try to make a lot of HTTP requests, and too many at
 * once cause some to start failing with weird errors. To fix this, we share TCP
 * sockets between requests and utilize `keepAlive` by installing an agent.
 */
export const createAgent = () => {
  setGlobalDispatcher(
    new Pool(BASE_URL, {
      pipelining: 10,
      connections: 25,
    })
  );
  return () => getGlobalDispatcher().destroy();
};
