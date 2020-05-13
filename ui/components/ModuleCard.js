Vue.component('ModuleCard', {
    name: 'ModuleCard',
    props: {
      name: String
    },
    data(){
        return {
            edit: false,
        }
    },
    methods:{
      updateName(val){
          this.$emit('update-module-name',val)
          this.edit = false
      }
    },
    template: `
    <div class="card">
  
                <div class="card-body">
                <h5 class="card-title">{{name}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Module</h6>
                <template v-if="edit">
                    <form-name @update-name="updateName" :name="name" @close="edit = null"></form-name>
                </template>
                
                <template v-else>
                    <button class="btn btn-sm ml-1 btn-primary float-right" @click="edit=true">EDIT</button>
                    <button class="btn btn-sm ml-1 float-right btn-dark" @click="$emit('load-module')">LOAD</button>
                    <button class="btn btn-sm ml-1 float-right btn-info" @click="$emit('load-demo-module')">LOAD DEMO</button>
                </template>
                </div>
    </div>
    `
})
