const ProviderContentGenerator = require("./generatorFront/ProviderContentGenerator");
const GqlFetchAllContentGenerator = require("./generatorFront/GqlFetchAllContentGenerator");
const GqlFetchByIDContentGenerator = require("./generatorFront/GqlFetchByIDContentGenerator");
const GqlCreateContentGenerator = require("./generatorFront/GqlCreateContentGenerator");
const GqlUpdateContentGenerator = require("./generatorFront/GqlUpdateContentGenerator");

const GqlFetchBySomethingContentGenerator = require("./generatorFront/GqlFetchBySomethingContentGenerator");

const ComponentCreateContentGenerator = require("./generatorFront/ComponentCreateContentGenerator");
const ComponentUpdateContentGenerator = require("./generatorFront/ComponentUpdateContentGenerator");
const ComponetDataTableContentGenerator = require("./generatorFront/ComponetDataTableContentGenerator");


const PageCRUDContentGenerator = require("./generatorFront/PageCRUDContentGenerator");


const CreateDir = require("./CreateDir");
const fs = require('fs');


const source = require('./input/source.json')


const outputpath = './output-front/'
const basepath = outputpath + source.module.toLowerCase()

const componentPath = basepath + '/components/' //FINAL
const pagePath = basepath + '/pages/' //FINAL
const providerPath = basepath + '/providers/'
const gqlPath = providerPath + '/gql/' //FINAL

//DIR: MODULE
CreateDir(basepath)
//DIR: Component
CreateDir(componentPath)
//DIR: Page
CreateDir(pagePath)
//DIR: provider
CreateDir(providerPath)
//DIR: GQL
CreateDir(gqlPath)

//CREATE  PROVIDER FILES

source.models.forEach(model => {
    let path = providerPath + model.name + 'Provider.js'
    fs.writeFile(path, ProviderContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Provider File OK: ' + model.name);
        })
})


//CREATE  GQL ALL FILES

source.models.forEach(model => {
    let path = gqlPath + model.name.toLowerCase() + 's.graphql'
    fs.writeFile(path, GqlFetchAllContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('GQL ALL File OK: ' + model.name);
        })
})

//CREATE  GQL ID FILES

source.models.forEach(model => {
    let path = gqlPath + model.name.toLowerCase() + '.graphql'
    fs.writeFile(path, GqlFetchByIDContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('GQL ID File OK: ' + model.name);
        })
})


//CREATE  GQL CREATE FILES

source.models.forEach(model => {
    let path = gqlPath + model.name.toLowerCase() + 'Create.graphql'
    fs.writeFile(path, GqlCreateContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('GQL CREATE File OK: ' + model.name);
        })
})

//CREATE  GQL UPDATE FILES

source.models.forEach(model => {
    let path = gqlPath + model.name.toLowerCase() + 'Update.graphql'
    fs.writeFile(path, GqlUpdateContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('GQL Update File OK: ' + model.name);
        })
})


//CREATE  Component Create FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'Create.vue'
    fs.writeFile(path, ComponentCreateContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Component Create File OK: ' + model.name);
        })
})


//CREATE  Component Update FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'Update.vue'
    fs.writeFile(path, ComponentUpdateContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Component Update File OK: ' + model.name);
        })
})


//CREATE  Component DataTable FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'DataTable.vue'
    fs.writeFile(path, ComponetDataTableContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Component DataTable File OK: ' + model.name);
        })
})


//CREATE  PAGE FILES

source.models.forEach(model => {
    let path = pagePath + model.name + 'Crud.vue'
    fs.writeFile(path, PageCRUDContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Page File OK: ' + model.name);
        })
})


//CREATE  GQL ID FILES

source.models.forEach(model => {

    model.properties.forEach(field => {
        if (field.findby) {
            let path = gqlPath + model.name.toLowerCase() + 'sBy' + capitalize(field.name) + '.graphql'
            fs.writeFile(path, GqlFetchBySomethingContentGenerator(model, field),
                (err) => {
                    if (err) return console.log(err);
                    console.log('GQL By Something File OK: ' + model.name + ' field: ' +field.name);
                })
        }
    })


})

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}
