import axios from "axios";
import { Agent } from "https";

/**
 * The scrapers (by default) try to make a lot of HTTP requests, and too many at
 * once cause some to start failing with weird errors. To fix this, we share TCP
 * sockets between requests and utilize `keepAlive` by installing an agent.
 */
export const createAgent = () => {
  axios.defaults.httpsAgent = new Agent({
    keepAlive: true,
    maxSockets: 100,
  });
  return () => axios.defaults.httpsAgent.destroy();
};
