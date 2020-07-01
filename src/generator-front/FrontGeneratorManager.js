const fs = require('fs');
const createDir = require("../utils/createDir");
const writeFile = require("../utils/writeFile");
const writeIndex = require("../utils/writeIndex");
const capitalize = require("../utils/capitalize");

const OUTPUT_PATH = './output/front/'

//Generators
const I18nMessages = require("./i18n/I18nMessages");
const Routes = require("./routes/Routes");
const Provider = require("./providers/Provider");
const PageCrud = require("./pages/PageCrud");
const ComponentCrud = require("./components/ComponentCrud");
const ComponentList = require("./components/ComponentList");
const ComponentForm = require("./components/ComponentForm");
const ComponentCreate = require("./components/ComponentCreate");
const ComponentUpdate = require("./components/ComponentUpdate");
const ComponentDelete = require("./components/ComponentDelete");
const ComponentShowData = require("./components/ComponentShowData");
const ComponentShow = require("./components/ComponentShow");

//GQL
const GqlFetchAll = require("./providers/gql/GqlFetchAll")
const GqlFetchByID = require("./providers/gql/GqlFetchByID")
const GqlPaginate = require("./providers/gql/GqlPaginate")
const GqlCreate = require("./providers/gql/GqlCreate")
const GqlUpdate = require("./providers/gql/GqlUpdate")
const GqlDelete = require("./providers/gql/GqlDelete")
const GqlFetchBySomething = require("./providers/gql/GqlFetchBySomething")

class FrontGeneratorManager {

    constructor(source) {
        this.source = source
    }

    getModuleLc() {
        if (this.source && this.source.module) {
            return this.source.module.toLowerCase()
        }
        throw new Error("source.module is required")
    }

    BASE_PATH() {
        return OUTPUT_PATH + this.getModuleLc()
    }


    I18N_PATH() {
        return this.BASE_PATH() + '/i18n/messages'
    }

    ROUTES_PATH() {
        return this.BASE_PATH() + '/routes'
    }

    PAGES_PATH() {
        return this.BASE_PATH() + '/pages/'
    }

    PROVIDERS_PATH() {
        return this.BASE_PATH() + '/providers/'
    }

    GQL_PATH() {
        return this.PROVIDERS_PATH() + '/gql/'
    }

    createDirs() {
        createDir(OUTPUT_PATH)
        createDir(this.BASE_PATH())
        createDir(this.I18N_PATH())
        createDir(this.ROUTES_PATH())
        createDir(this.PAGES_PATH())
        createDir(this.PROVIDERS_PATH())
        createDir(this.GQL_PATH())
    }

    generateI18n() {
        let path = this.I18N_PATH() + '/index.js'
        writeFile(path, I18nMessages, this.source, 'i18n')
    }

    generateRoutes() {
        let path = this.ROUTES_PATH() + '/index.js'
        writeFile(path, Routes, this.source.models, 'Routes')
    }


    generateProviders() {
        this.source.models.forEach(model => {
            let path = this.PROVIDERS_PATH() + model.name + 'Provider.js'
            writeFile(path, Provider, model, 'Provider')
        })
    }

    generateGqlAll() {
        this.source.models.forEach(model => {
            let name = model.name.toLowerCase() + 's'
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + fileName
            writeFile(filePath, GqlFetchAll, model, fileName)
        })
    }

    generateGqlById() {
        this.source.models.forEach(model => {
            let name = model.name.toLowerCase()
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + fileName
            writeFile(filePath, GqlFetchByID, model, fileName)
        })
    }

    generateGqlPaginate() {
        this.source.models.forEach(model => {
            let name = model.name.toLowerCase() + 'sPaginate'
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + fileName
            writeFile(filePath, GqlPaginate, model, fileName)
        })
    }

    generateGqlCreate() {
        this.source.models.forEach(model => {
            let name = model.name.toLowerCase() + 'Create'
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + fileName
            writeFile(filePath, GqlCreate, model, fileName)
        })
    }

    generateGqlUpdate() {
        this.source.models.forEach(model => {
            let name = model.name.toLowerCase() + 'Update'
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + fileName
            writeFile(filePath, GqlUpdate, model, fileName)
        })
    }

    generateGqlDelete() {
        this.source.models.forEach(model => {
            let name = model.name.toLowerCase() + 'Delete'
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + fileName
            writeFile(filePath, GqlDelete, model, fileName)
        })
    }

    generateGqlFetchBySomething() {
        this.source.models.forEach(model => {
            model.properties.forEach(field => {
                if (field.findby) {
                    let name = model.name.toLowerCase() + 'sBy' + capitalize(field.name) + '.graphql'
                    let fileName = name + '.graphql'
                    let filePath = this.GQL_PATH() + fileName
                    writeFile(filePath, GqlFetchBySomething, {model,field}, fileName)
                }
            })
        })

    }

    PAGE_MANAGEMENT_PATH(model){
        if(model && model.name){
            return this.PAGES_PATH() + model.name + 'ManagementPage/'
        }
        throw new Error("model.name is required")
    }

    generatePages() {
        this.source.models.forEach(model => {
            createDir(this.PAGE_MANAGEMENT_PATH(model))
            let path = this.PAGE_MANAGEMENT_PATH(model) + 'index.vue'
            writeFile(path, PageCrud, model, 'Page')
        })
    }

    generateForm() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Form/'
            createDir(dirPath)
            let name = model.name + 'Form'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentForm, {model: model, moduleName: this.source.module}, 'Form')
            writeIndex(dirPath, name)
        })
    }

    generateCreate() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Create/'
            createDir(dirPath)
            let name = model.name + 'Create'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentCreate, {model: model, moduleName: this.source.module}, 'Create')
            writeIndex(dirPath, name)
        })
    }

    generateUpdate() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Update/'
            createDir(dirPath)
            let name = model.name + 'Update'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentUpdate, {model: model, moduleName: this.source.module}, 'Update')
            writeIndex(dirPath, name)
        })
    }

    generateDelete() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Delete/'
            createDir(dirPath)
            let name = model.name + 'Delete'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentDelete, {model: model, moduleName: this.source.module}, 'Delete')
            writeIndex(dirPath, name)
        })
    }

    generateShowData() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Show/'
            createDir(dirPath)
            let name = model.name + 'ShowData'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentShowData, {model: model, moduleName: this.source.module}, 'ShowData')
        })
    }

    generateShow() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Show/'
            createDir(dirPath)
            let name = model.name + 'Show'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentShow, model, 'Show')
            writeIndex(dirPath, name)
        })
    }

    generateList() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'List/'
            createDir(dirPath)
            let name = model.name + 'List'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentList, {model: model, moduleName: this.source.module}, 'List')
            writeIndex(dirPath, name)
        })
    }

    generateCrud() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_MANAGEMENT_PATH(model) + model.name + 'Crud/'
            createDir(dirPath)
            let name = model.name + 'Crud'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentCrud, {model: model, moduleName: this.source.module}, 'Crud')
            writeIndex(dirPath, name)
        })
    }

}

module.exports = FrontGeneratorManager;