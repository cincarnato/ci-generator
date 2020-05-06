var app = new Vue({
    el: '#app',
    computed: {
        getModuleColor() {
            return (index) => {
                return (index == this.selected) ? 'grey' : 'transparent'
            }
        }
    },
    data: {
        message: 'Hello Vue!',
        selected: null,
        modules: [{
            name: "Demo"
        }]
    }
})


Vue.component('formProperty', {
    data() {
        return {
            options: ['String','Int','Float','Date','ObjectId'],
            form: {
                name: '',
                type: '',
                required: false,
                search: false
            }
        }
    },
    template: `<div class="row">

    <div class="col-12 py-1">
       <label class="px-1">Name: </label><input type="text" v-model="form.name">
    </div>
    
    <div class="col-12 py-1">
        <label class="px-1">Type: </label>
        <select type="text" v-model="form.type">
            <option v-for="(v,i) in options" :value="v" :key="i">{{v}}</option>
        </select>
    </div>
    
    <div class="col-12 py-1" v-if="form.type =='ObjectId'">
        <label class="px-1">Ref: </label><input type="text" v-model="form.ref">
    </div>
    
    <div class="col-12 py-1">
        <label class="px-1">Required: </label><input type="checkbox" v-model="form.required">
    </div>
    
    <div class="col-12 py-1" >
        <label class="px-1">Use in search: </label><input type="checkbox" v-model="form.search">
    </div>
    
</div>`
})
