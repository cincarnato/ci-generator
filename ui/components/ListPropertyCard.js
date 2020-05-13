Vue.component('ListPropertyCard', {
    name: 'ListPropertyCard',
    props: {
        entityName: String,
        properties: Array,
        selected: Number
    },
    methods: {
        select(index) {
            this.$emit('select-prop', index)
        },
        addProp() {
            this.$emit('add-prop')
        },
        delProp(){
            if(this.selected !== null){
                this.$emit('del-prop', this.selected)
            }
        }
    },
    template: `
<div class="card">
    <div class="card-body">
        <h6 class="card-subtitle mb-2 text-muted"><b>{{entityName}}</b> Properties</h6>
        <ul class="list-group">
            <li :class="{'active': index==selected}"
                class="list-group-item pt-1 pb-1"
                v-for="(prop,index) in properties" :key="index"
                @click="select(index)">{{prop.name}}
            </li>
        </ul>
        <div class="py-2">
          <button class="btn btn-sm btn-outline-success" @click="addProp">Add</button>
          <button class="btn btn-sm btn-outline-danger" @click="delProp">del</button>
        </div>
    </div>
</div>
    `
})
