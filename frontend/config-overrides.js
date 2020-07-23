const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    common: '../common',
    '@common': 'common',
  })(config)

  return config
}