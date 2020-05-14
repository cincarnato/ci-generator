
Vue.component('Modal', {
    name:'Modal',
    props: {
        title: String,
        body: String,
        show: {type:Boolean, default:false}
    },
    template:`
    <div class="modal fade" tabindex="-1" :class="{show: show}" :style="{display: show?'block':'none'}" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{title}}</h5>
        <button @click="$emit('close')" type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {{body}}
      </div>
    </div>
  </div>
</div>
    `
})
