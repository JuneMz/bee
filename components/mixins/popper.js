import PopperJS from 'popper.js'

export default {
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: {},
    popper: {},
    offset: {
      default: 0
    },
    visibleArrow: Boolean,
    transition: String,
    appendToBody: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false
        }
      }
    }
  },

  data() {
    return {
      visible: false,
      currentPalcement: this.placement
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.updatePopper()
      } else {
        this.destroyPopper()
      }
    }
  },

  computed: {
    placementCls() {
      const cls = this.currentPalcement[0] + (this.currentPalcement.length > 1 ? { start: 'Left' }[this.currentPalcement[1]] : '')
      return [`${this.prefixCls}-placement-${cls}`]
    }
  },
  methods: {
    createPopper() {
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
        return
      }
      this.popperEl = this.popperEl || this.popper || this.$refs.popper
      this.referenceEl = this.referenceEl || this.reference || this.$refs.reference
      const params = this.params
      const popper = this.popperEl
      let reference = this.referenceEl

      if (!reference &&
        this.$slots.reference &&
        this.$slots.reference[0]) {
        reference = this.referenceEl = this.$slots.reference[0].elm
      }
      if (!popper || !reference) return
      if (this.visibleArrow) this.appendArrow(popper)
      if (this.appendToBody) document.body.appendChild(this.popperEl)
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy()
      }

      params.placement = this.placement
      params.offset = this.offset
      params.boundariesPadding = this.boundariesPadding
      this.popperJS = new PopperJS(reference, popper, params)
      this.popperJS.onCreate(() => {
        this.$emit('created', this)
        this.resetTransformOrigin()
        this.$nextTick(this.updatePopper)
      })
      this.popperJS.onUpdate(() => {
        this.getPlacement()
      })
    },

    getPlacement() {
      this.currentPalcement = this.popperEl.getAttribute('x-placement').split('-')
      return this.currentPalcement
    },

    updatePopper() {
      if (this.popperJS) {
        this.getPlacement()
        this.popperJS.update()
      } else {
        this.createPopper()
      }
    },

    doDestroy() {
      /* istanbul ignore if */
      if (this.visible || !this.popperJS) return
      this.popperJS.destroy()
      this.popperJS = null
    },

    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin()
      }
    },

    resetTransformOrigin() {
      const placementMap = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
      const placement = this.getPlacement()[0]
      const origin = placementMap[placement]
      this.popperEl.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1
        ? `center ${origin}`
        : `${origin} center`
    },

    appendArrow(element) {
      let hash
      if (this.appended) {
        return
      }

      this.appended = true

      Object.keys(element.attributes).some((item) => {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name
          return true
        }
        return false
      })

      const arrow = document.createElement('div')

      if (hash) {
        arrow.setAttribute(hash, '')
      }
      arrow.setAttribute('x-arrow', '')
      arrow.className = 'popper__arrow'
      element.appendChild(arrow)
    }
  },

  beforeDestroy() {
    this.doDestroy()
    if (this.popperEl && this.popperEl.parentNode === document.body) {
      document.body.removeChild(this.popperEl)
    }
  }
}
