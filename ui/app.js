var app = new Vue({
    el: '#app',
    computed: {
        getPropSelected() {
            if (this.propSelected === null) {
                return {
                    name: '', type: '', ref: '', label: '', icon: '', required: false, search: false,
                    en: '', es: '', pt: ''
                }
            }else{
                return this.models[this.modelselected].properties[this.propSelected]
            }

        }
    },
    methods: {
        addModel(model) {
            this.models.push({name: model, properties: []})
        },
        apply(property) {
            console.log(property)
            if (this.modelselected !== null && this.models[this.modelselected] !== undefined) {
                let index = this.models[this.modelselected].properties.findIndex(prop => prop.name == property.name)
                if (index === -1) {
                    this.propSelected = this.models[this.modelselected].properties.push(property) -1
                } else {
                    this.models[this.modelselected].properties[index] = property
                }
            }
        }
    },
    data: {
        modelselected: null,
        propSelected: null,
        showNewModel: false,
        models: [{
            name: "Demo",
            properties: []
        }]
    }
})

