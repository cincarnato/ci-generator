
Vue.component('formProperty', {
    props:{
        p: {type:Object, default: () => {return {name:'',type:'', ref:'', label:'',icon:'',required:false,search: false, en:'',es:'',pt:''} } }
    },
    data() {
        return {
            options: ['String','Int','Float','Date','ObjectId'],
            errors:[],
            form: {
                name: this.p.name?this.p.name:'',
                type: this.p.type?this.p.type:'',
                ref: this.p.ref?this.p.ref:'',
                label: this.p.label?this.p.label:'',
                icon: this.p.icon?this.p.icon:'',
                required: this.p.required?this.p.required:false,
                search: this.p.search?this.p.search:false,
                en: this.p.en?this.p.en:'',
                es: this.p.es?this.p.es:'',
                pt: this.p.pt?this.p.pt:'',
            }
        }
    },
    watch:{
        p:{
            deep:true,
            handler: function(val){
                this.form = Object.assign({},val)
            }
        }
    },
    methods:{
        apply(){
            let error = false

            //Check name required
            if(this.form.name.length == 0){
                this.errors.push('name')
                error = true
            }else{
                let index = this.errors.indexOf('name');
                if (index !== -1) this.errors.splice(index, 1);
            }

            //Check type required
            if(this.form.type.length == 0){
                error = true
                this.errors.push('type')
            }else{
                let index = this.errors.indexOf('type');
                if (index !== -1) this.errors.splice(index, 1);
            }

            //Check ref required
            if(this.form.type == 'ObjectId' && this.form.ref.length == 0){
                error = true
                this.errors.push('ref')
            }else{
                let index = this.errors.indexOf('ref');
                if (index !== -1) this.errors.splice(index, 1);
            }

            if(!error){
                this.$emit('apply', Object.assign({}, this.form) )
            }else{
                console.log('ERROR')
            }
        }
    },
    template: `<div class="row">

    <div class="col-12 py-1">
       <label class="px-1">Name:</label><input :class="{'error': errors.includes('name')}" type="text" v-model="form.name">
    </div>
    
    <div class="col-12 py-1">
        <label class="px-1">Type:</label>
        <select :class="{'error': errors.includes('name')}" type="text" v-model="form.type">
            <option v-for="(v,i) in options" :value="v" :key="i">{{v}}</option>
        </select>
    </div>
    
    <div class="col-12 py-1" v-if="form.type =='ObjectId'">
        <label class="px-1">Ref: </label><input :class="{'error': errors.includes('ref')}"  type="text" v-model="form.ref">
    </div>
    
    <div class="col-12 py-1">
       <label class="px-1">Label: </label><input type="text" v-model="form.label">
    </div>
    
    <div class="col-12 py-1">
       <label class="px-1">Icon: </label><input type="text" v-model="form.icon">
    </div>
    
    <div class="col-12 py-1">
        <label class="px-1">Required: </label><input type="checkbox" v-model="form.required">
    </div>
    
    <div class="col-12 py-1" >
        <label class="px-1">Use in search: </label><input type="checkbox" v-model="form.search">
    </div>
    
    <div class="col-12 py-1">
        <h4>Translations</h4>
    </div>
    
    <div class="col-12 py-1">
       <label class="px-1">en: </label><input type="text" v-model="form.en">
    </div>
    
    <div class="col-12 py-1">
       <label class="px-1">es: </label><input type="text" v-model="form.es">
    </div>
    
    <div class="col-12 py-1">
       <label class="px-1">pt: </label><input type="text" v-model="form.pt">
    </div>
    
     <div class="col-12 py-1" >
        <button @click="apply">Apply</button>
     </div>
</div>`
})
