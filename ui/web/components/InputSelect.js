Vue.component('InputSelect', {
    name: 'InputSelect',
    props: {
        label: String,
        value: String,
        name: String,
        options: Array,
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
       <select 
               class="form-control form-control-sm" 
               :class="{'is-invalid': errors.includes(name)}" 
               v-model="val"
       >
            <option v-for="(v,i) in options" :value="v" :key="i">{{v}}</option>
       </select>
    </div>
</div>
    `
})
