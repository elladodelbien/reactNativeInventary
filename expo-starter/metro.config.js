const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Configuración específica para Hermes
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    comments: false,
  },
};

module.exports = config;
