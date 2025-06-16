import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import babel from 'vite-plugin-babel'
import presetUno from '@unocss/preset-uno'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    babel(),
    UnoCSS({
      mode: 'shadow-dom',
      presets: [presetUno()],
    }),
  ],
  build: {
    // 我们将使用 rollupOptions.input 来处理多个入口和不同的输出
    // 因此 lib 选项可以简化或移除，具体取决于是否还希望保留 lib 模式的某些默认行为
    // 为了更精细的控制，我们直接配置 rollupOptions
    // lib: { ... }, // 可以注释掉或移除此部分
    outDir: 'dist', // 确保输出目录是 dist
    rollupOptions: {
      input: {
        // 主入口包，包含 entry.js 的内容
        'jj-demo-block-bundle': resolve(__dirname, 'src/entry.js'),
        // 单独的组件，输出到 components 目录下
        'components/jj-demo-block': resolve(__dirname, 'src/jj-demo-block.js'),
        'components/jj-demo-block-setting': resolve(__dirname, 'src/jj-demo-block-setting.js'),
      },
      output: [
        {
          format: 'es',
          // entryFileNames 用于控制每个入口块的文件名
          // chunkFileNames 用于控制代码分割产生的块的文件名
          entryFileNames: '[name].js', // 例如：jj-demo-block-bundle.js, components/jj-demo-block.js
          chunkFileNames: 'chunks/[name]-[hash].js',
          dir: 'dist', // 输出目录
          inlineDynamicImports: false, // 添加此行
        },
      ],
      // external: ['lit', '@lit/context'], // 将 lit 和 @lit/context 视为外部依赖
    },
  },
})
