# JJ Demo Block

该 Demo 块是基于 Lit 开发的 Web Component 组件，理论上可以运行在任何框架里，目前仅对 VitePress 场景做介绍。

## 在 VitePress 中使用

### 1. 安装

```bash
npm install jj-demo-block -S
```

### 2. 组织你的 Demo 代码

约定在项目根目录下创建一个 `examples` 文件夹，用于存放你的 Demo 代码。子级可以自由组织，如下，可以用组件划分维度。

```bash
.
├── .vitepress/
│   ├── theme/
│   │   └──  index.js
│   └── config.js
├── examples/
│   ├── radio/
│   │   ├── disabled.vue
│   │   └── shape.vue
│   └── tag/
│       └── type.vue
│       └── round.vue
│       └── closeable.vue
├── README.md
```

### 3. 配置 VitePress 主题

在文件：`.vitepress/theme/index.js` 中，写入如下内容

```javascript
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent, h } from 'vue'
import 'jj-demo-block'
// 这里的glob pattern可以根据实际的目录结构做调整
const examples = import.meta.glob('../../examples/**/*.vue')

export default {
  extends: DefaultTheme,
  Layout() {
    return h('jj-demo-block-setting', null, [h(DefaultTheme.Layout)])
  },
  enhanceApp: ({ app }) => {
    Object.entries(examples).forEach(([path, importFunc]) => {
      app.component(
        'exp-' +
          path
            .replace(/^.*?examples\//, '')
            .replace(/\.vue$/, '')
            .replace(/\//, '-'),
        defineAsyncComponent(importFunc)
      )
    })
  },
}
```

最后在`.vitepress/config.js`中配置将`jj-`开头的组件都视为 Web Component

```javascript
export default defineConfig({
  vue: {
    template: {
      compilerOptions: {
        // 将所有前缀为 jj- 的标签名都视为自定义元素
        isCustomElement: (tag) => tag.startsWith('jj-'),
      },
    },
  },
})
```

### 4. 配置 Markdown 插件并注册

定义`.vitepress/plugins/markdown/demo.js`文件，写入：

```javascript
import path from 'path'
import fs from 'fs'
export default function createDemoContainer(md) {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      // 这里只能获取到 token 字符串信息，已知examples路径，后续拼接的字符串都需要提供
      const m = tokens[idx].info.trim().match(/^demo\s*\[(.*?)\].*$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const otherProps = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(path.resolve('examples', `${sourceFile}.vue`), 'utf-8')
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        const compTagName = `exp-${sourceFile.replaceAll('/', '-')}`
        const sourceHtml = md
          .render(`\`\`\` vue\n${source}\`\`\``)
          .replace(/^<div /, '<div slot="source" style="margin: 0" ')
        return `<jj-demo-block rawSource="${encodeURIComponent(
          source
        )}" iframeUrl="/example?is=${compTagName}" ${otherProps ? `${otherProps}` : ''}>
          ${sourceHtml}
        <!-- <${compTagName} /> -->`
      } else {
        return '</jj-demo-block>\n'
      }
    },
  }
}
```

接着在`.vitepress/config.js`中注册该插件

```javascript
import mdContainer from 'markdown-it-container'
import createDemoContainer from './plugins/markdown/demo.js'
export default defineConfig({
  markdown: {
    config: (md) => md.use(mdContainer, 'demo', createDemoContainer(md)),
  },
})
```

### 5. 创建`/example`页面（如果非 iframe 模式该步可省略）

在第 4 步中，将`iframeUrl`的值设为`/example?is=xxx`，因此本站需要一个该路径的页面

在根目录下创建`/example.md`，写入：

```markdown
---
layout: false
---

<script setup>
import { ref, onMounted } from 'vue'
const is = ref('')
onMounted(() => {
  const url = new URL(window.location.href)
  is.value = new URLSearchParams(url.search).get('is')
})
</script>

<component v-if="is" :is="is" />

<style>
jj-demo-block-setting::part(setting-icon) {
  display: none;
}
</style>
```

### 6. 测试成果

fds 创建`examples/radio/disabled.vue`、`examples/simple.vue`等演示文件，

在`xx.md`文件中写入

```markdown
以下是 radio 的禁用演示

::: demo

radio/disabled

:::

以下是 一个简单功能演示

::: demo [isShowSourcePermanently iframeHeight="500px"]

simple

:::
```
