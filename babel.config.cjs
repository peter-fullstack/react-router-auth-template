module.exports = {
  presets: [
    ['@babel/preset-typescript'],
    ['@babel/preset-env', { modules: 'auto' }],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ],
  plugins: [
    // Transform import.meta.env to process.env for Jest
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === 'import' &&
              path.node.property.name === 'meta'
            ) {
              path.replaceWithSourceString('process')
            }
          }
        }
      }
    }
  ]
}
