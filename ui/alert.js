
Vue.component('alert', {
  template:`<div class="success">{{message}}</div>`,
  created(){
      setTimeout(()=>this.$emit('end'),800)
  },
  props:{
      message: String
  }
})
