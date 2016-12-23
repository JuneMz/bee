function Store(component, initialState = {}) {
  if (!component) {
    throw new Error('component is required.')
  }
  this.component = component

  this.state = {
    ENUM_MODE: {
      VERTICAL: 'vertical',
      HORIZONTAL: 'horizontal',
      INLINE: 'inline'
    },
    uniqueOpened: false,
    openIndexs: [],
    selectedIndex: '',
    router: false
  }

  Object.keys(initialState).forEach((prop) => {
    if ({}.hasOwnProperty.call(this.state, prop)) {
      this.state[prop] = initialState[prop]
    }
  })
}

Store.prototype.openChange = function openChange() {
  const deepNodes = (nodes) => {
    nodes.forEach((node) => {
      if (node.$options.name === 'VSubMenu') {
        node.opened = this.state.openIndexs.indexOf(node.index) > -1
      }
      deepNodes(node.$children)
    })
  }
  deepNodes(this.component.$children)
  this.component.$emit('onOpenChange', this.state.openIndexs)
}

Store.prototype.mutations = {
  openMenu(state, { index, indexPath = [] }) {
    if (state.openIndexs.indexOf(index) > -1) return
    if (state.uniqueOpened) {
      state.openIndexs = [].concat(indexPath)
    } else {
      state.openIndexs.push(index)
    }
    this.openChange()
  },
  closeMenu(state, { index }) {
    const i = state.openIndexs.indexOf(index)
    if (i > -1) {
      state.openIndexs.splice(i, 1)
      this.openChange()
    }
  },
  selectMenu(state, { index }) {
    state.selectedIndex = index

    let item
    const deepNodes = (nodes) => {
      nodes.forEach((node) => {
        if (node.$options.name === 'VMenuItem') {
          node.selected = node.index === this.state.selectedIndex
          if (node.selected) item = node
        } else if (node.$options.name === 'VSubMenu') {
          let selected = false
          const deepNode = (childNodes) => {
            childNodes.forEach((childNode) => {
              if (childNode.$options.name === 'VMenuItem') {
                childNode.selected = childNode.index === this.state.selectedIndex
                if (childNode.selected) selected = true
              } else {
                deepNode(childNode.$children)
              }
            })
          }
          deepNode(node.$children)
          node.selected = selected
          deepNodes(node.$children)
        } else {
          deepNodes(node.$children)
        }
      })
    }

    deepNodes(this.component.$children)
    if (item) {
      if (state.router) this.component.$router.push(this.state.selectedIndex)
      this.component.$emit('onSelect', this.state.selectedIndex, item)
    }
  }
}

Store.prototype.commit = function commit(name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, [this.state].concat(args))
  }
}

export default Store
