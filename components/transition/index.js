import Collapse from './collapse'
import SideUp from './slide-up'

export default {
  name: 'VTransition',
  functional: true,
  render(createElement, context) {
    const type = context.data.attrs.type
    let data
    switch (type) {
      case 'collapse':
        data = new Collapse()
        break
      case 'slide-up':
        data = new SideUp()
        break
      default:
    }
    return createElement('transition', data, context.children)
  }
}
