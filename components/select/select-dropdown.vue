<template>
  <div class="ant-select-dropdown  ant-select-dropdown-placement-bottomLeft"
       ref="dropdown"
       v-show="visible">
    <v-menu prefixCls="ant-select-dropdown">
      <slot></slot>
    </v-menu>
  </div>
</template>

<style scoped>
  .ant-select-dropdown {
    margin: 2px 0px;
  }
</style>

<script type="text/babel">
  import Popper from '../mixins/popper'
  import Clickoutside from '../utils/clickoutside'

  export default {
    mixins: [Popper],
    directives: { Clickoutside },
    data() {
      return {
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
      this.popperEl = this.$el
      this.referenceEl = this.$parent.$el
      this.popperEl.style.width = this.referenceEl.style.width
      this.referenceEl.addEventListener('click', this.toggle)
    }
  }
</script>
