import { getGlobalDispatcher, Pool, setGlobalDispatcher } from "undici";

/**
 * The scrapers (by default) try to make a lot of HTTP requests, and too many at
 * once cause some to start failing with weird errors. To fix this, we share TCP
 * sockets between requests and utilize `keepAlive` by installing an agent.
 */
export const createAgent = () => {
  setGlobalDispatcher(
    new Pool("https://catalog.northeastern.edu", {
      pipelining: 10,
      connections: 25,
    })
  );
  return () => getGlobalDispatcher().destroy();
};
