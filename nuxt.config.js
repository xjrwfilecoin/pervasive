
export default {
  mode: 'universal',

  resourceHints: false,

  router: {
    middleware: [
      'check-auth'
    ],
    router: {
	    base: './'
	  }
  },
  
  /*
  ** Headers of the page
  */
  head: {
    title: '星际荣威科技有限公司',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '星际荣威科技有限公司' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/manage/LOGO-webBCG.png' }
    ]
  },

  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    prefix: 'http://192.168.0.164:9090/api/',        
    proxy: true,  
  },
  proxy: {
    '/api/': { 
      target: 'https://xingjirw.com', 
      pathRewrite: {'^/api/': ''} 
    }
  },

  env: {
    // baseURL: 'https://xingjirw.com/api/', // 生产
    // uploadURL: 'https://xingjirw.com/static', // 资源地址,

    // baseURL: '//139.186.84.15:9090/api/', // 测试-新
    // uploadURL: '//139.186.84.15:9090/static', // 资源地址,

    // baseURL: '//110.185.107.117:9090/api/', // 测试
    // uploadURL: '//110.185.107.117:9090/static', // 资源地址,

    baseURL: '//192.168.0.164:9999', // 本地
    uploadURL: '//192.168.0.164:9999/static', // 资源地址,
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    './static/manage/font/common.css',
    './static/manage/font/iconfont/iconfont.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/axios',
    '~plugins/echarts',
    // { src: '@/plugins/sockjs', ssr: false },
    { src: '@/plugins/route', ssr: true },
    { src: "./static/manage/font/iconfont/iconfont.js", ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {

    // optimization: {
    //   splitChunks: {
    //     minSize: 10000,
    //     maxSize: 250000
    //   }
    // },
    transpile: [/^element-ui/],
    // publicPath: './manage/client/', // 生产静态资源路径
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
