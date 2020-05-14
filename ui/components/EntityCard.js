Vue.component('EntityCard', {
        name: 'EntityCard',
        props: {
            entities: Array,
            moduleName: String
        },
        data() {
            return {
                editing: null,
                selected: null,
                creating: null
            }
        },
        methods: {
            selectEntity(index) {
                this.selected = index
                this.$emit('selected-entity', index)
            },
            createEntity(name) {
                this.$emit('create-entity', name)
                this.creating = false
            },
            updateEntity(name) {
                this.$emit('update-entity', this.selected, name)
                this.editing = null
            },
            deleteEntity(index) {
                this.selected = null
                this.$emit('selected-entity', this.selected)
                this.$emit('delete-entity', index)
            }
        },
        template: `
<div class="card">
    <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted "> <b>{{moduleName}}</b> Entities</h6>
        <ul class="list-group">
            <li :class="{'active': index==selected}"
                class="list-group-item pt-1 pb-1"
                v-for="(model,index) in entities"
                :key="index"
                @click="selectEntity(index)">

                <template v-if="editing == index">
                    <form-name @update-name="updateEntity" 
                                :name="model.name"
                                @close="editing= null">
                    </form-name>
                </template>

                <template v-else>
                    {{model.name}}
                   
                </template>

            </li>
        </ul>
        <div class="mt-2">
         <button class="btn btn-sm btn-outline-danger float-right" @click="deleteEntity(selected)">
         del
         </button>
         <button class="btn btn-sm btn-outline-primary mx-1 float-right" @click="editing=selected">
         edit
         </button>
        <button class="btn btn-sm btn-outline-success" @click="creating=true">
         Add
        </button>
        <div v-if="creating">
            <form-name @update-name="createEntity" @close="creating= false"></form-name>
        </div>
        </div>
    </div>
</div>
    `
    }
)
