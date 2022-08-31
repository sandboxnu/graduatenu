module.exports = function (api) {
  api.cache(true);

  return {
    env: {
      development: {
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
        plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
        babelrcRoots: [".", "packages/*"],
      },
      browser: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: "last 2 Chrome versions",
              },
              modules: false,
            },
          ],
          "@babel/preset-typescript",
        ],
        plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
        babelrcRoots: [".", "packages/*"],
      },
      module: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                node: "14",
              },
              modules: false,
            },
          ],
          "@babel/preset-typescript",
        ],
        plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
        babelrcRoots: [".", "packages/*"],
      },
    },
  };
};
