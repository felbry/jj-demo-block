import { LitElement, css, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { customElement } from 'lit/decorators.js'
import { searchIcon } from './icons.js' // 引入设置图标

@customElement('jj-demo-block-desktop-view')
export class JjDemoBlockMobileView extends LitElement {
  render() {
    return html`<div
      class="rounded-3 bg-[var(--vp-c-bg,#fff)] b-(px solid [var(--vp-c-border,#c2c2c4)]) p-3 relative"
    >
      <div
        class="box-border absolute left-50% -translate-x-50% top-0 w-30 h-3 flex justify-center items-center gap-2"
      >
        <div class="w-1 h-1 rounded-full b-(px solid [var(--vp-c-text-3,#929295)]) mr-2"></div>
        <div class="w-20 h-1 rounded-1 b-(px solid [var(--vp-c-text-3,#929295)])"></div>
        <div class="w-1 h-1 rounded-full b-(px solid [var(--vp-c-text-3,#929295)])"></div>
      </div>
      <div class="w-full b-(px solid [var(--vp-c-border,#c2c2c4)]) overflow-hidden">
        <div class="h-8 bg-[var(--vp-c-bg-alt,#f6f6f7)] relative">
          <div class="h-8 flex items-center gap-2 ml-4">
            <div class="w-2.5 h-2.5 rounded-full bg-[var(--vp-c-red-1,#f66f81)]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[var(--vp-c-yellow-1,#f9b44e)]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[var(--vp-c-green-1,#3dd68c)]"></div>
          </div>
          <div
            class="h-5.5 leading-5.5 w-45% rounded-xl bg-[var(--vp-c-bg,#fff)] absolute left-50% -translate-x-50% top-50% -translate-y-50% text-align-center text-sm text-[var(--vp-c-text-2,#67676c)]"
          >
            www.demo.com
            <div class="absolute top-0 right-2 h-full flex items-center">
              ${unsafeHTML(searchIcon)}
            </div>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>`
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 0 auto;
        }
      `,
      css`
        @unocss-placeholder;
      `,
    ]
  }
}
