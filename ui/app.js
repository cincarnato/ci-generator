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
        updateModuleName(name){
            this.moduleName = name
        },
        getSource() {
            let body = JSON.stringify({module: this.moduleName, models: this.models})
            return body
        },
        loadDemoModule(){
          this.moduleName = 'Demo'
          this.loadModule()
        },
        loadModule() {
            fetch('http://localhost:4060/load/'+this.moduleName)
                .then(r => {
                    return r.json()
                }).then(j => {
                    this.models = j.models
                }
            )
                .catch(err => this.apiStatus = 'FAIL')
        },
        generate(){

        },
        save() {
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
        editModel(index, name) {
            console.log('edit',index,name)
            this.models[index].name = name
        },
        createModel(name) {
            let index = this.models.findIndex(m => m.name == name)
            if (index === -1) {
                this.models.push({name: name, properties: []})
            } else {
                this.modelselected = index
                alert('The model '+name+ ' already exists')
            }
            this.showNewModel = false
        },
        deleteModel(index){
          this.models.splice(index,1)
        },
        selectModel(index){
          this.modelselected = index
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
        moduleName: '',
        apiStatus: '',
        modelselected: null,
        modeledit: null,
        propSelected: null,
        showNewModel: false,
        models: []
    }
})

