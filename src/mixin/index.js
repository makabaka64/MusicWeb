export const mixins = {
  data() {
    return {
      msg: '我是小猪课堂'
    }
  },

  computed: {},

  created() {
    console.log('我是mixin中的created生命周期函数')
  },

  mounted() {
    console.log('我是mixin中的mounted生命周期函数')
  },

  methods: {
    clickMe() {
      console.log('我是mixin中的点击事件')
    }
  }
}
