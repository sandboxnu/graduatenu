const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

/**
 * A proxy that forwards "/api" requests to the server running on port 3001 and all
 * other requests to the frontend running on port 3000.
 */
const proxy = createProxyMiddleware({
  target: "http://localhost:3000", // all requests to be routed to frontend running on port 3000
  router: {
    "/api": "http://localhost:3001", // all requests prefixed with "/api" to be routed to backend running on port 3001
  },
  ws: true,
  logLevel: "warn",
});

app.use("/", proxy);

// Run the proxy on port 3002
app.listen(3002, () => {
  console.log("GraduateNU is up and ready!");
});
