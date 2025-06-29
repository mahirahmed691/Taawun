const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  return {
    resolver: {
      assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'), // example adjustment if you handle svg differently
    },
  };
})();
