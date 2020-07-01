Vue.component('InputCheckbox', {
    name: 'InputCheckbox',
    props: {
        label: String,
        value: Boolean,
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
    <label class="col-sm-3 col-form-label text-right">{{label}}: </label>
    <div class="col-sm-9">
        <div class="form-check ">
            <input 
                    :class="{'is-invalid': errors.includes(name)}"  
                    class="form-check-input" 
                    type="checkbox" 
                    v-model="val" 
                    style="width: 20px; height: 20px;"
            >
        </div>
    </div>
</div>
    `
})
