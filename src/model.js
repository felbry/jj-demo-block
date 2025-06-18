import { mobileIcon, desktopIcon } from './icons.js' // 引入设置图标

export const LOCAL_STORAGE_KEY = 'jj-demo-block-setting'

export class GloablSetting {
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
          checked: true,
          icon: mobileIcon,
        },
        {
          id: 2,
          width: '100%',
          type: 'desktop',
          name: 'Desktop',
          enable: true,
          checked: false,
          icon: desktopIcon,
        },
      ]
    }
  }
}
