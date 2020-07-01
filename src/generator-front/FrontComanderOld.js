const ProviderContentGenerator = require("./providers/Provider");
const GqlFetchAllContentGenerator = require("./providers/gql/GqlFetchAll");
const GqlFetchByIDContentGenerator = require("./providers/gql/GqlFetchByID");
const GqlCreateContentGenerator = require("./providers/gql/GqlCreate");
const GqlUpdateContentGenerator = require("./providers/gql/GqlUpdate");
const GqlDeleteContentGenerator = require("./providers/gql/GqlDelete");
const GqlPaginateContentGenerator = require("./providers/gql/GqlPaginate");

const GqlFetchBySomethingContentGenerator = require("./providers/gql/GqlFetchBySomething");

const ComponentCreate = require("./components/ComponentCreate");
const ComponentUpdate = require("./components/ComponentUpdate");
const ComponentDelete = require("./components/ComponentDelete");
const ComponetList = require("./components/ComponentList");
const ComponetCrud = require("./generator-front/components/ComponetCrud");
const ComponentForm = require("./components/ComponentForm");
//ShowData
const ComponetShowData = require("./components/ComponentShowData");
const ComponetShow = require("./components/ComponentShow");

//i18n
const I18nMessagesGenerator = require("./i18n/I18nMessages");

const PageCRUDContentGenerator = require("./pages/PageCrud");


const CreateDir = require("../utils/createDir");
const fs = require('fs');


const commander = require('commander');
commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-f, --file <file>', 'Set the source file')
    .parse(process.argv);

const sourceFile = (commander.file ? commander.file : './input/source.json');

console.log("FILE:", sourceFile)

const source = require(sourceFile)


const outputpath = './output/front/'
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


//I18N

let path = basepath + '/' + source.module.toLowerCase() +'-i18n-messages.js'
fs.writeFile(path, I18nMessagesGenerator(source),
    (err) => {
        if (err) return console.log(err);
        console.log('i18n File OK: ' + source);
    })



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

//CREATE  GQL DELETE FILES

source.models.forEach(model => {
    let path = gqlPath + model.name.toLowerCase() + 'Delete.graphql'
    fs.writeFile(path, GqlDeleteContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('GQL Delete File OK: ' + model.name);
        })
})

//CREATE  GQL PAGINATE FILES

source.models.forEach(model => {
    let path = gqlPath + model.name.toLowerCase() + 'sPaginate.graphql'
    fs.writeFile(path, GqlPaginateContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('GQL Paginate File OK: ' + model.name);
        })
})

//CREATE  Component Create FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'Create.vue'
    fs.writeFile(path, ComponentCreate(model,source.module),
        (err) => {
            if (err) return console.log(err);
            console.log('Component Create File OK: ' + model.name);
        })
})


//CREATE  Component Update FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'Update.vue'
    fs.writeFile(path, ComponentUpdate(model,source.module),
        (err) => {
            if (err) return console.log(err);
            console.log('Component Update File OK: ' + model.name);
        })
})

//CREATE  Component DELETE FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'Delete.vue'
    fs.writeFile(path, ComponentDeleteContentGenerator(model,source.module ),
        (err) => {
            if (err) return console.log(err);
            console.log('Component Delete File OK: ' + model.name);
        })
})

//CREATE  Component DataTable FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'DataTable.vue'
    fs.writeFile(path, ComponetDataTableContentGenerator(model,source.module),
        (err) => {
            if (err) return console.log(err);
            console.log('Component DataTable File OK: ' + model.name);
        })
})


//CREATE  Component ShowDataItems FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'ShowDataItem.vue'
    fs.writeFile(path, ComponetShowDataItemContentGenerator(model,source.module),
        (err) => {
            if (err) return console.log(err);
            console.log('Component ShowDataItem File OK: ' + model.name);
        })
})

//CREATE  Component ShowData FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'ShowData.vue'
    fs.writeFile(path, ComponetShowDataContentGenerator(model,source.module),
        (err) => {
            if (err) return console.log(err);
            console.log('Component ShowData File OK: ' + model.name);
        })
})

//CREATE  Component Show FILES

source.models.forEach(model => {
    let path = componentPath + model.name + 'Show.vue'
    fs.writeFile(path, ComponetShowContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Component Show File OK: ' + model.name);
        })
})

//CREATE  PAGE FILES

source.models.forEach(model => {
    let path = pagePath + model.name + 'CrudPage.vue'
    fs.writeFile(path, PageCRUDContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Page File OK: ' + model.name);
        })
})


//CREATE  GQL By Shomething

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
