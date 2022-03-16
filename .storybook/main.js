const custom = require('./webpack.config.js');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  stories: ['../**/*.story.js', '../**/*.story.jsx', '../**/*.stories.js', '../**/*.story.ts', '../**/*.story.tsx', '../**/*.stories.tsx'],
  addons: [
    '@storybook/preset-scss',
    '@storybook/preset-typescript',
    'storybook-addon-react-docgen',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-postcss',
  ],
  webpackFinal: (config) => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ['json'],
      }),
    );
    return {
      ...config,
      resolve: { ...config.resolve, ...custom.resolve },
      module: { ...config.module, rules: custom.module.rules },
      // plugins: [
      //   new MonacoWebpackPlugin({
      //     // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      //     languages: ['json'],
      //   }),
      // ],
    };
  },
  core: {
    builder: 'webpack5',
  },
};
