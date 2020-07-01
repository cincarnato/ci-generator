Vue.component('formName', {
    props: {
        name: {type: String, default:''}
    },
    data(){
        return {
            error: false,
            value: this.name
        }
    },
    methods: {
        apply(){
            this.$emit('update-name',this.value)
        },
        close(){
            this.$emit('close')
        }
    },
    template: `
    <div>
       <div class="col-12 py-1">
       <label class="px-1">Name:</label>
       <input class="form-control-sm" :class="{'error': error}" type="text" v-model="value" @keyup.enter="apply" @keyup.escape="close">
       <button class="btn-success" @click="apply">ok</button>
    </div>
    </div>
    `
})
