const ModelContentGenerator = require("./generatorBack/ModelContentGenerator");
const TypeContentGenerator = require("./generatorBack/TypeContentGenerator");
const ServiceContentGenerator = require("./generatorBack/ServiceContentGenerator");
const ResolverContentGenerator = require("./generatorBack/ResolverContentGenerator");
const GraphIndexContentGenerator = require("./generatorBack/GraphIndexContentGenerator");
const PermissionsGenerator = require("./generatorBack/PermissionsGenerator");
const CreateDir = require("./CreateDir");
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


const outputpath = './output/back/'
const basepath = outputpath + source.module.toLowerCase()

const modelpath = basepath + '/models/' //FINAL
const servicePath = basepath + '/services/' //FINAL
const permissionsPath = basepath + '/permissions/' //FINAL
const graphqlpath = basepath + '/graphql'
const typespath = graphqlpath + '/types/' //FINAL
const resolverspath = graphqlpath + '/resolvers/' //FINAL

//DIR: MODULE
CreateDir(basepath)
//DIR: permissions
CreateDir(permissionsPath)
//DIR: models
CreateDir(modelpath)
//DIR: Services
CreateDir(servicePath)
//DIR: types
CreateDir(typespath)
//DIR: resolvers
CreateDir(resolverspath)


//PERMISSIONS
source.models.forEach(model => {
    let path = permissionsPath + model.name + '.js'
    fs.writeFile(path, PermissionsGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Permissions File OK: ' + model.name);
        })
})

//CREATE  MODEL FILES

source.models.forEach(model => {
    let path = modelpath + model.name + 'Model.js'
    fs.writeFile(path, ModelContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Model File OK: ' + model.name);
        })
})

//CREATE SERVICE FILES

source.models.forEach(model => {
    let path = servicePath + model.name + 'Service.js'
    fs.writeFile(path, ServiceContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Service File OK: ' + model.name);
        })
})

//CREATE TYPES FILES

source.models.forEach(model => {
    let path = typespath + model.name + 'Types.graphql'
    fs.writeFile(path, TypeContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Type File OK: ' + model.name);
        })
})


//CREATE RESOLVER FILES

source.models.forEach(model => {
    let path = resolverspath + model.name + 'Resolvers.js'
    fs.writeFile(path, ResolverContentGenerator(model),
        (err) => {
            if (err) return console.log(err);
            console.log('Resolver File OK: ' + model.name);
        })
})

//CREATE GRAPH INDEX
let path = graphqlpath + '/api.js'
fs.writeFile(path, GraphIndexContentGenerator(),
    (err) => {
        if (err) return console.log(err);
        console.log('Graph Index File OK');
    })
