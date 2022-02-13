const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const proxy = createProxyMiddleware({
  target: "http://localhost:3001",
  router: {
    "/api": "http://localhost:3002",
  },
  ws: true,
  logLevel: "warn",
});

app.use("/", proxy);
app.listen(3000, () => {
  console.log("GraduateNU is up and ready!");
});
