const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const isStage = process.env.NODE_ENV === 'staging'
const envFilename = isStage ? '.env.stage' : isDev ? '.env.dev' : '.env.prod'
require('dotenv').config({ path: envFilename })

export default {
  ssr: false,
  globalName: 'app',
  components: false,
  loading: false,
  server: require('./configs/server.js').default,
  i18n: require('./configs/i18n.js').default,
  router: require('./configs/router.js').default,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/styles/global.scss'
  ],

  styleResources: {
    scss: ['assets/styles/prepend.scss']
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/filters.js' },
    { src: '~/plugins/date/nuxt.plugin.js' },
    { src: '~/plugins/router.js', mode: 'client' },
    { src: '~/plugins/persistedState.js', mode: 'client' },
    { src: '~/plugins/spinner/nuxt.plugin.js', mode: 'client' },
    { src: '~/plugins/web3/nuxt.plugin.js', mode: 'client' },
    { src: '~/plugins/observe-visibility.js', mode: 'client' }
  ],

  serverMiddleware: [],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'nuxt-client-init-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    'nuxt-i18n'
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    publicPath: process.env.PUBLIC_PATH,
    extractCSS: process.env.EXTRACTCSS === '1',
    // analyze: true,
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.i18n$/,
        loader: `@kazupon/vue-i18n-loader?${JSON.stringify({
          includePaths: [path.resolve(__dirname), 'node_modules']
        })}`
      })
      config.module.rules.push({
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader'
      })
      config.module.rules.push({
        test: /\.(mp3|mp4)$/,
        loader: 'file-loader'
      })
    },
    loaders: {
      cssModules: {
        modules: {
          localIdentName: isDev ? '[name]_[local]_[hash:base64:2]' : '[hash:base64:8]'
        }
      }
    }
  },
  env: {}
}
