var app = new Vue({
    el: '#app',
    computed: {
        getPropSelected() {
            if (this.propSelected === null) {
                return {
                    name: '', type: '', ref: '', label: '', icon: '', required: false, search: false,
                    i18n: {en: '', es: '', pt: ''}
                }
            } else {
                return this.models[this.modelselected].properties[this.propSelected]
            }
        }
    },
    created() {
        this.getApiStatus()
    },
    methods: {
        getSource() {
            let body = JSON.stringify({module: this.moduleName, models: this.models})
            return body
        },
        loadSource() {
            fetch('http://localhost:4060/load/'+this.moduleName)
                .then(r => {
                    return r.json()
                }).then(j => {
                    this.models = j.models
                }
            )
                .catch(err => this.apiStatus = 'FAIL')
        },
        saveSource() {
            fetch('http://localhost:4060/save',
                {method: 'POST', body: this.getSource(), headers: {'Content-type': 'application/json'}}
            )
                .then(r => {
                    r.text().then(b => this.apiStatus = b)
                })
                .catch(err => this.apiStatus = 'FAIL')
        },
        getApiStatus() {
            fetch('http://localhost:4060/status')
                .then(r => {
                    r.text().then(b => this.apiStatus = b)
                })
                .catch(err => this.apiStatus = 'DOWN')
        },
        editModule(name) {
            this.moduleName = name
            this.moduleEdit = false
        },
        editModel(name) {
            this.models[this.modeledit].name = name
            this.modeledit = null
        },
        addModel(model) {
            let index = this.models.findIndex(m => m.name == model)
            if (index === -1) {
                this.models.push({name: model, properties: []})
            } else {
                this.modelselected = index
            }
            this.showNewModel = false

        },
        apply(property) {
            console.log(property)
            if (this.modelselected !== null && this.models[this.modelselected] !== undefined) {
                let index = this.models[this.modelselected].properties.findIndex(prop => prop.name == property.name)
                if (index === -1) {
                    this.alert = 'Added'
                    this.propSelected = this.models[this.modelselected].properties.push(property) - 1
                } else {
                    this.alert = 'Updated'
                    this.models[this.modelselected].properties[index] = property
                }
            }
        }
    },
    data: {
        alert: null,
        moduleName: 'Demo',
        moduleEdit: false,
        apiStatus: '',
        modelselected: null,
        modeledit: null,
        propSelected: null,
        showNewModel: false,
        models: []
    }
})

