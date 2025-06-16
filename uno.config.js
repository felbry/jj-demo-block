// 该配置文件为了让unocss vscode插件生效
import { defineConfig, transformerVariantGroup } from 'unocss'

export default defineConfig({
  transformers: [
    // <div class="hover:(bg-gray-400 font-medium) font-(light mono)"/> 转换为： <div class="hover:bg-gray-400 hover:font-medium font-light font-mono"/>
    transformerVariantGroup(),
  ],
})
