import { LitElement, css, html, nothing } from 'lit'
import { cache } from 'lit/directives/cache.js'
import { customElement, property, state, query } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { consume } from '@lit/context'
import { settingContext } from './context/setting-context.js'
import { copyIcon, copiedIcon, codeIcon, arrowIcon } from './icons.js'
import './jj-demo-block-desktop-view.js'
import './jj-demo-block-mobile-view.js'

// vitepress的默认主题变量
// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css

// 静态的用bg即可
// 如果涉及激活/非激活态，或者是突出显示的背景+文字，有neutral和neutral-inverse可用（黑白）

/**
 * 代码演示块
 */
@customElement('jj-demo-block')
export class JjDemoBlock extends LitElement {
  @property()
  accessor iframeUrl = '' // 如果有值，效果展示区域链接至该url

  @property()
  accessor iframeHeight = '100%'

  @property({ attribute: false })
  accessor rawSource = 'hello, world' // 原始代码，用于复制

  @property({ type: Boolean })
  accessor isShowSourcePermanently = false // 是否永久显示原始代码

  /**
   * 全局设置
   * -------------------------------------------------------------------------- */
  @consume({ context: settingContext, subscribe: true })
  @state()
  accessor globalSetting = {}

  @state()
  accessor _devices = []

  _onCheckDevice(id) {
    this._devices.forEach((item) => {
      item.checked = item.id === id
    })
    this.requestUpdate()
  }
  willUpdate(changeProperties) {
    if (changeProperties.has('globalSetting')) {
      this._devices = JSON.parse(JSON.stringify(this.globalSetting.devices || []))
    }
  }

  /**
   * 复制代码
   * -------------------------------------------------------------------------- */
  @state()
  accessor _isCopied = false

  async _onCopyCode() {
    if (this._isCopied) return
    try {
      await navigator.clipboard.writeText(decodeURIComponent(this.rawSource))
      this._isCopied = true
      // 可选：一段时间后自动恢复复制图标和提示
      setTimeout(() => {
        this._isCopied = false
      }, 2000) // 2秒后恢复
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  /**
   * 展示/隐藏代码
   * -------------------------------------------------------------------------- */
  @state()
  accessor _isShowSource = false

  _onToggleSourceVisible() {
    this._isShowSource = !this._isShowSource
  }

  render() {
    return html`<div
      class="flex-1 rounded text-[var(--vp-c-text-1,#3c3c43)]"
      @click=${this._onClick}
    >
      ${this.globalSetting.isShowHeader
        ? html`<div class="flex justify-center items-center gap-2 mb-2">
            ${this._devices
              .filter(({ enable }) => enable)
              .map(
                ({ id, icon, checked }) => html`<div
                  class="px-2 py-1 rounded-md cursor-pointer ${checked
                    ? 'bg-[var(--vp-c-neutral,#000)] text-[--vp-c-neutral-inverse,#fff]'
                    : 'bg-[var(--vp-c-neutral-inverse,#fff)] text-[--vp-c-neutral,#000] b-(px solid [var(--vp-c-border,#c2c2c4)])'} flex cursor-pointer"
                  @click=${() => !checked && this._onCheckDevice(id)}
                >
                  ${unsafeHTML(icon)}
                </div>`
              )}
          </div>`
        : nothing}
      ${/desktop/.test(this._devices.find(({ checked }) => checked).type)
        ? html`<jj-demo-block-desktop-view
            style="width: ${this._devices.find(({ checked }) => checked).width}"
          >
            <div class="min-h-20 max-h-65vh overflow-auto ${this.iframeUrl ? '' : 'p-2'}">
              ${this.iframeUrl
                ? html`<iframe
                    src=${this.iframeUrl}
                    frameborder="0"
                    width="100%"
                    style="height: ${this.iframeHeight}"
                    loading="lazy"
                  ></iframe>`
                : html`<slot></slot>`}
            </div>
          </jj-demo-block-desktop-view>`
        : html`<jj-demo-block-mobile-view
            style="width: ${this._devices.find(({ checked }) => checked).width}"
          >
            <div class="min-h-20 max-h-65vh overflow-auto ${this.iframeUrl ? '' : 'p-2'}">
              ${this.iframeUrl
                ? html`<iframe
                    src=${this.iframeUrl}
                    frameborder="0"
                    width="100%"
                    style="height: ${this.iframeHeight}"
                    loading="lazy"
                  ></iframe>`
                : html`<slot></slot>`}
            </div>
          </jj-demo-block-mobile-view>`}
      <div
        class="p-2 flex justify-center items-center gap-3 text-[var(--vp-c-text-2,#67676c)] text-0"
      >
        <div
          tooltip="${this._isCopied ? '已复制' : '复制代码'}"
          position="bottom"
          @click=${this._onCopyCode}
          class="flex cursor-pointer hover:([&>svg]:(text-[var(--vp-c-brand-1,#3451b2)] stroke-2))"
        >
          ${unsafeHTML(this._isCopied ? copiedIcon : copyIcon)}
        </div>
        ${this.isShowSourcePermanently
          ? nothing
          : html`<div
              tooltip=${this._isShowSource ? '隐藏代码' : '查看代码'}
              position="bottom"
              class="flex cursor-pointer hover:([&>svg]:(text-[var(--vp-c-brand-1,#3451b2)] stroke-2))"
              @click=${this._onToggleSourceVisible}
            >
              ${unsafeHTML(codeIcon)}
            </div>`}
      </div>
      <!-- md.render后的html片段，用于展示代码，目前不通过prop接收了，因为生成的html片段包含class，可能依赖运行环境，而由于web component的隔离型，class样式无法应用 -->
      ${this.isShowSourcePermanently || this._isShowSource
        ? html`<slot name="source"></slot>`
        : nothing}
      <!-- 收起箭头 -->
      ${this.isShowSourcePermanently
        ? nothing
        : html`${cache(
            this._isShowSource
              ? html`<div
                  class="flex justify-center items-center b-t-(px solid [var(--vp-c-divider,#e2e2e3)]) h-10 bg-[var(--vp-c-bg,#fff)] rd-b-1 text-[var(--vp-c-text-2,#67676c)] cursor-pointer sticky left-0 right-0 bottom-0 z-10 hover:text-[var(--vp-c-indigo-1,#3451b2)]"
                  @click=${() => (this._isShowSource = false)}
                >
                  ${unsafeHTML(arrowIcon)}隐藏代码
                </div>`
              : nothing
          )}`}
    </div>`
  }

  static get styles() {
    return [
      css`
        @unocss-placeholder;
      `,
      css`
        :host {
          display: flex;
        }
      `,
      css`
        [tooltip] {
          position: relative;
          display: inline-block;
        }
        [tooltip]::before {
          content: '';
          position: absolute;
          border-width: 4px 6px 0 6px;
          border-style: solid;
          border-color: transparent;
          border-top-color: var(--vp-c-neutral, #000);
          z-index: 99;
          opacity: 0;
        }
        [tooltip]::after {
          content: attr(tooltip);
          position: absolute;
          background: var(--vp-c-neutral, #000);
          text-align: center;
          color: var(--vp-c-neutral-inverse, #fff);
          border-radius: 5px;
          padding: 4px 2px;
          min-width: 80px;
          pointer-events: none;
          z-index: 99;
          opacity: 0;
          font-size: 14px;
        }
        [tooltip]:hover::after,
        [tooltip]:hover::before {
          opacity: 1;
        }
        [tooltip][position='bottom']::before {
          top: 100%;
          left: 50%;
          margin-top: 1px;
          transform: translatex(-50%) rotate(180deg);
        }
        [tooltip][position='bottom']::after {
          top: 100%;
          left: 50%;
          margin-top: 5px;
          transform: translatex(-50%);
        }
      `,
    ]
  }
}
