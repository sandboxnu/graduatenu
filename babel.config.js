module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "14",
          },
        },
      ],
      "@babel/preset-typescript",
    ],
    plugins: [],
    babelrcRoots: [".", "packages/*"],
  };
};
