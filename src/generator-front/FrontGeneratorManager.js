const fs = require('fs');
const createDir = require("../utils/createDir");

const OUTPUT_PATH = '../../output/front/'

//Generators
const I18nMessages = require("./i18n/I18nMessages");
const Provider = require("./providers/Provider");

class GeneratorManager {

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
        createDir(this.PAGES_PATH())
        createDir(this.PROVIDERS_PATH())
        createDir(this.GQL_PATH())
    }

    writeFile(path, generator, param, name) {
        fs.writeFile(path, generator(param),
            (err) => {
                if (err) return console.log(err);
                console.log(name + ' OK.');
            })
    }

    generateI18n() {
        let path = this.I18N_PATH() + '/messages.js'
        this.writeFile(path, I18nMessages, this.source, 'i18n')
    }

    generateProvider() {
        this.source.models.forEach(model => {
            let path = this.PROVIDERS_PATH() + model.name + 'Provider.js'
            this.writeFile(path, Provider, model, 'Provider')
        })
    }

}

module.exports = GeneratorManager;