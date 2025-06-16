import { LitElement, css, html, nothing } from 'lit'
import { state, property } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { settingContext } from './context/setting-context.js'
import { mobileIcon, desktopIcon } from './icons.js' // 引入设置图标

const LOCAL_STORAGE_KEY = 'jj-demo-block-setting'

class GloablSetting {
  constructor() {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedSettings) {
      Object.assign(this, JSON.parse(savedSettings))
      // 确保 icon 属性仍然是导入的 SVG 字符串，而不是 localStorage 中的普通字符串
      // （如果 icon 是动态加载或有其他复杂逻辑，这里可能需要更复杂的处理）
      this.devices.forEach((device) => {
        if (device.type === 'mobile') device.icon = mobileIcon
        if (device.type === 'desktop') device.icon = desktopIcon
      })
    } else {
      this.isShowHeader = true
      this.devices = [
        {
          id: 1,
          width: '375px',
          type: 'mobile',
          name: 'Mobile',
          enable: true,
          checked: false,
          icon: mobileIcon,
        },
        {
          id: 2,
          width: '100%',
          type: 'desktop',
          name: 'Desktop',
          enable: true,
          checked: true,
          icon: desktopIcon,
        },
      ]
    }
  }
}
export class JjDemoBlockSetting extends LitElement {
  @provide({ context: settingContext })
  @property({ attribute: false })
  accessor globalSetting = new GloablSetting()

  _saveGlobalSetting() {
    const settingToSave = JSON.parse(JSON.stringify(this.globalSetting))
    settingToSave.devices.forEach((device) => delete device.icon)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingToSave))
    this.globalSetting = { ...this.globalSetting }
  }

  _toggleIsShowHeader(event) {
    this.globalSetting.isShowHeader = event.target.checked
    this._saveGlobalSetting()
  }

  _toggleDeviceEnable(deviceId, event) {
    const device = this.globalSetting.devices.find((d) => d.id === deviceId)
    if (device) {
      device.enable = event.target.checked
      // 如果禁用了当前选中的设备，则默认选中第一个启用的设备
      if (!device.enable && device.checked) {
        device.checked = false
        const firstEnabled = this.globalSetting.devices.find((d) => d.enable)
        if (firstEnabled) {
          firstEnabled.checked = true
        }
      }
      // 如果所有设备都被禁用了，确保 isShowHeader 也为 false （可选逻辑）
      if (!this.globalSetting.devices.some((d) => d.enable)) {
        this.globalSetting.isShowHeader = false
      }
      this._saveGlobalSetting()
    }
  }

  _checkDevice(deviceId) {
    this.globalSetting.devices.forEach((device) => {
      device.checked = device.id === deviceId
    })
    this._saveGlobalSetting()
  }

  render() {
    const enabledDevices = this.globalSetting.devices.filter((d) => d.enable)
    return html`<div>
      <slot></slot>
      <div class="setting-container fixed bottom-5 right-5 z-20">
        <div
          part="setting-icon"
          class="setting-icon w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer shadow-lg"
        >
          ⚙️
        </div>
        <div
          class="setting-panel absolute bottom-full right-0 p-4 w-72 bg-white rounded-md shadow-xl border border-gray-200 z-10"
        >
          <h3 class="text-lg font-semibold mb-3">Demo设置</h3>

          <div class="mb-3 pb-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <label
                for="isShowHeaderToggle"
                class="text-sm text-gray-700"
                >显示设备切换栏</label
              >
              <input
                type="checkbox"
                id="isShowHeaderToggle"
                .checked=${this.globalSetting.isShowHeader}
                @change=${this._toggleIsShowHeader}
                class="form-checkbox"
              />
            </div>
          </div>

          <div class="mb-3 pb-3 border-b border-gray-200">
            <h4 class="text-md font-semibold mb-2 text-gray-800">启用设备</h4>
            ${this.globalSetting.devices.map(
              (device) => html`<div class="flex items-center justify-between mb-1">
                <label
                  for="deviceEnable-${device.id}"
                  class="text-sm text-gray-600"
                  >${device.name}</label
                >
                <input
                  type="checkbox"
                  id="deviceEnable-${device.id}"
                  .checked=${device.enable}
                  @change=${(e) => this._toggleDeviceEnable(device.id, e)}
                  class="form-checkbox"
                />
              </div>`
            )}
          </div>

          ${enabledDevices.length > 0
            ? html`<div class="mb-2">
                <h4 class="text-md font-semibold mb-2 text-gray-800">选择设备</h4>
                ${enabledDevices.map(
                  (device) => html`<div class="flex items-center mb-1">
                    <input
                      type="radio"
                      id="deviceCheck-${device.id}"
                      name="activeDevice"
                      .value=${device.id.toString()}
                      .checked=${device.checked}
                      @change=${() => this._checkDevice(device.id)}
                      class="form-radio mr-2"
                    />
                    <label
                      for="deviceCheck-${device.id}"
                      class="text-sm text-gray-600"
                      >${device.name} (${device.width})</label
                    >
                  </div>`
                )}
              </div>`
            : html`<p class="text-sm text-gray-500">请至少启用一个设备</p>`}
        </div>
      </div>
    </div>`
  }

  static get styles() {
    return [
      css`
        .form-checkbox,
        .form-radio {
          appearance: none;
          padding: 0;
          display: inline-block;
          vertical-align: middle;
          background-origin: border-box;
          user-select: none;
          flex-shrink: 0;
          height: 1rem;
          width: 1rem;
          color: #2563eb; /* blue-600 */
          background-color: #fff;
          border: 1px solid #adb5bd;
        }
        .form-checkbox {
          border-radius: 0.25rem;
        }
        .form-radio {
          border-radius: 50%;
        }
        .form-checkbox:checked {
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
          border-color: transparent;
          background-color: currentColor;
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .form-radio:checked {
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
          border-color: transparent;
          background-color: currentColor;
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* CSS-only hover effect for setting panel */
        .setting-container .setting-panel {
          display: none; /* 或者 opacity: 0; visibility: hidden; transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out; */
        }
        .setting-container:hover .setting-panel {
          display: block; /* 或者 opacity: 1; visibility: visible; */
        }
      `,
      css`
        @unocss-placeholder;
      `,
    ]
  }
}

window.customElements.define('jj-demo-block-setting', JjDemoBlockSetting)
