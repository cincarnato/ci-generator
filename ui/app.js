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
        },
        getSource() {
            let body = JSON.stringify({module: this.moduleName, models: this.models})
            console.log(body)
            return body
        }
    },
    created() {
        this.getApiStatus()
    },
    methods: {
        loadSource() {
            fetch('http://localhost:4060/load',
                {method: 'POST', body: this.getSource, headers: {'Content-type': 'application/json'}}
            )
                .then(r => {
                    r.text().then(b => this.apiStatus = b)
                })
                .catch(err => this.apiStatus = 'FAIL')
        },
        saveSource() {
            fetch('http://localhost:4060/save',
                {method: 'POST', body: this.getSource, headers: {'Content-type': 'application/json'}}
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
                    this.propSelected = this.models[this.modelselected].properties.push(property) - 1
                } else {
                    this.models[this.modelselected].properties[index] = property
                }
            }
        }
    },
    data: {
        moduleName: 'Demo',
        moduleEdit: false,
        apiStatus: '',
        modelselected: null,
        modeledit: null,
        propSelected: null,
        showNewModel: false,
        models: [{
            name: "Contact",
            properties: [
                {
                    name: 'nickname',
                    type: 'String',
                    label: '',
                    icon: '',
                    required: false,
                    search: false,
                    i18n: {en: 'Nickname', es: 'Sobrenombre', pt: 'Apelido'}
                },
                {
                    name: 'email',
                    type: 'String',
                    label: '',
                    icon: '',
                    required: false,
                    search: false,
                    i18n: {en: 'Email', es: 'Correo electronico', pt: 'Email'}
                }
            ]
        }]
    }
})

