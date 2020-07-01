Vue.component('InputText', {
    name: 'InputText',
    props: {
        label: String,
        value: String,
        name: String,
        errors: Array
    },
    computed: {
      val:{
          get(){
              return this.value
          },
          set(val){
              this.$emit('input',val)
          }
      }
    },
    template: `
<div class="form-group row mb-0">
    <label class="col-sm-3 col-form-label text-right">{{label}}:</label>
    <div class="col-sm-9">
        <input class="form-control form-control-sm" 
                :class="{'is-invalid': errors.includes(name)}" 
                type="text" 
                v-model="val" 
        />
    </div>
</div>
    `
})
