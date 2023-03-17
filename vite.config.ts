import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type UserConfigFn, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// polyfill https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
// import legacy from '@vitejs/plugin-legacy'

export const generateViteConfig: UserConfigFn = (env: ConfigEnv) => {
  const { command, mode } = env
  const ENV = loadEnv(mode, process.cwd())
  console.info(`running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`)

  return {
    server: {
      strictPort: true,
      host: '0.0.0.0',
      port: 5173,
      // strictPort: false,
      // https: false,
      // open: '/',
      disableHostCheck: true, // 解决127.0.0.1指向其他域名时出现"Invalid Host header"问题
      // https://vitejs.dev/config/#server-proxy
      proxy: {
        '^/(gateway)': {
          target: 'https://xxx.com', // alpha
          // headers: { host: 'xxx.com' },
          changOrigin: true, // 配置跨域
          //ws: true, // 配置ws跨域
          secure: false, // https协议才设置
          //loglevel: 'debug',
          //rewrite: path => path.replace(/^\/api/, ''),
        }
      },
    },
    resolve: {
      extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // additionalData: `$injectedColor: orange;`
          additionalData: '@import "@/assets/stylesheets/globalInjectedData.scss";',
        },
        // less: {
        //   modifyVars: {
        //     '@primary-color': '#1990EB',
        //   },
        //   javascriptEnabled: true,
        // }
      },
      // postcss: {}
    },
    build: {
      sourcemap: mode === 'development',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        }
      },
      // rollupOptions: {
      //   output:{
      //     manualChunks: {
      //       'lodash-es': ['lodash-es'],
      //     }
      //   }
      // }
    },
    plugins: [
      vue(),
      vueJsx(),
      // legacy({
      //   targets: ['defaults'/*, 'not IE 11'*/, 'ie >= 11'],
      //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      // })
    ],
  }
}

// https://vitejs.dev/config/
export default defineConfig(generateViteConfig)
