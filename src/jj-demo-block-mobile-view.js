import { LitElement, css, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { customElement } from 'lit/decorators.js'
import { signalIcon, wifiIcon, batteryIcon } from './icons.js' // 引入设置图标

@customElement('jj-demo-block-mobile-view')
export class JjDemoBlockMobileView extends LitElement {
  render() {
    return html`<div
      class="rounded-10 bg-[var(--vp-c-bg,#fff)] b-(px solid [var(--vp-c-border,#c2c2c4)]) p-2 relative"
    >
      <div
        class="box-border absolute left-50% -translate-x-50% top-2 w-30 h-5 bg-[var(--vp-c-bg,#fff)] rounded-b-15 b-x-(px solid [var(--vp-c-border,#c2c2c4)]) b-b-(px solid [var(--vp-c-border,#c2c2c4)]) flex justify-center gap-2 pt-1"
      >
        <div class="w-12 h-.5 rounded-1 b-(px solid [var(--vp-c-text-3,#929295)])"></div>
        <div class="w-.5 h-.5 rounded-full b-(px solid [var(--vp-c-text-3,#929295)])"></div>
      </div>
      <div class="w-full rounded-8 b-(px solid [var(--vp-c-border,#c2c2c4)]) overflow-hidden">
        <div
          class="h-5 bg-[var(--vp-c-bg-alt,#f6f6f7)] px-6 flex justify-between items-center text-sm font-500"
        >
          5:19
          <div class="h-full flex items-center gap-1">
            ${unsafeHTML(signalIcon)}${unsafeHTML(wifiIcon)}${unsafeHTML(batteryIcon)}
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
