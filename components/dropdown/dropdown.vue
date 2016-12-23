<template>
  <div v-clickoutside="hide">
    <slot name="title"></slot>
    <v-transition type="slide-up">
      <div class="ant-dropdown"
           :class="placementCls"
           ref="menu"
           v-show="visible">
        <slot name="menu"></slot>
      </div>
    </v-transition>
  </div>
</template>

<style lang="less">
  @import './style/index.less';
  @import '../button/style/index.less';
</style>

<script type="text/babel">
  import Popper from '../mixins/popper'
  import Clickoutside from '../utils/clickoutside'

  export default {
    name: 'VDropdown',
    mixins: [Popper],
    directives: { Clickoutside },
    props: {
      trigger: {
        type: String,
        default: 'hover'
      }
    },
    data() {
      return {
        prefixCls: 'ant-dropdown',
        timeout: null
      }
    },
    methods: {
      show() {
        clearTimeout(this.timeout)
        this.visible = true
      },
      hide() {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.visible = false
        }, 150)
      },
      toggle() {
        this.visible = !this.visible
      }
    },
    computed: {
      placement() {
        return 'bottom-start'
      }
    },
    mounted() {
      const menuEl = this.$refs.menu
      const titleEl = this.$slots.title[0].elm
      if (this.trigger === 'click') {
        titleEl.addEventListener('click', this.toggle)
      } else {
        titleEl.addEventListener('mouseenter', this.show)
        titleEl.addEventListener('mouseleave', this.hide)

        menuEl.addEventListener('mouseenter', this.show)
        menuEl.addEventListener('mouseleave', this.hide)
      }

      this.popperEl = menuEl
      this.referenceEl = titleEl
    }
  }
</script>


