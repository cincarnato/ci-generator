Vue.component('formModel', {
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
            this.$emit('model',this.value)
        }
    },
    template: `
    <div>
       <div class="col-12 py-1">
       <label class="px-1">Name:</label>
       <input :class="{'error': error}" type="text" v-model="value" @keyup.escape="$emit('close')">
       <button @click="apply">ok</button>
    </div>
    </div>
    `
})
