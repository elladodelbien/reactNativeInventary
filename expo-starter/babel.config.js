module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", {
        jsxImportSource: "react",
        lazyImports: true,
      }]
    ],
    plugins: [
      "@babel/plugin-transform-object-rest-spread",
      "@babel/plugin-transform-optional-chaining",
      "@babel/plugin-transform-nullish-coalescing-operator",
      [
        "react-native-reanimated/plugin",
        {
          globals: ["__scanFaces"],
        },
      ],
    ],
  };
};
