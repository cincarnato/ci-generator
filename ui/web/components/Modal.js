Vue.component('Modal', {
    name: 'Modal',
    props: {
        title: String,
        body: String,
        show: {type: Boolean, default: false}
    },
    template: `
<div>
    <div class="modal-backdrop fade" :class="{show: show}" :style="{display: show?'block':'none'}"></div>

    <div class="modal fade"  :class="{show: show}" :style="{display: show?'block':'none'}" role="dialog">
      <div class="modal-dialog" tabindex="-1">
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
</div>
    `
})
