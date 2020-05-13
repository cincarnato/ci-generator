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
        }
    },
    template: `
<div class="card">
    <div class="card-body">
        <h3><span class="module">{{entityName}}</span> Properties </h3>
        <ul class="list-group">
            <li :class="{'active': index==selected}"
                class="list-group-item"
                v-for="(prop,index) in properties" :key="index"
                @click="select(index)">{{prop.name}}
            </li>
        </ul>
        <button class="btn btn-sm btn-outline-success" @click="addProp">Add</button>
    </div>
</div>
    `
})
