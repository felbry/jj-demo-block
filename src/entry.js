// 导入并注册（如果它们是自定义元素且尚未在各自文件中注册）
// 或者导入并导出，以便库的使用者可以按需导入
import './jj-demo-block.js'
import './jj-demo-block-setting.js'

// 如果您希望通过这个入口点导出这些组件的类，可以这样做：
export { JjDemoBlock } from './jj-demo-block.js' // 假设 JjDemoBlock 是命名导出的
export { JjDemoBlockSetting } from './jj-demo-block-setting.js' // 假设 JjDemoBlockSetting 是命名导出的

// 如果它们只是注册自定义元素，并且您不打算从这个入口导出类，
// 那么上面的 import 语句就足够了。
