const ModelContentGenerator = require("./generatorBack/ModelContentGenerator");
const TypeContentGenerator = require("./generatorBack/TypeContentGenerator");
const ServiceContentGenerator = require("./generatorBack/ServiceContentGenerator");
const ResolverContentGenerator = require("./generatorBack/ResolverContentGenerator");
const GraphIndexContentGenerator = require("./generatorBack/GraphIndexContentGenerator");
const CreateDir = require("./CreateDir");
const fs = require('fs');


const source = require('./input/source_appointment.json')


const outputpath = './output/back/'
const basepath = outputpath + source.module.toLowerCase()

const modelpath = basepath + '/models/' //FINAL
const servicePath = basepath + '/services/' //FINAL
const graphqlpath = basepath + '/graphql'
const typespath = graphqlpath + '/types/' //FINAL
const resolverspath = graphqlpath + '/resolvers/' //FINAL

//DIR: MODULE
CreateDir(basepath)
//DIR: models
CreateDir(modelpath)
//DIR: Services
CreateDir(servicePath)
//DIR: types
CreateDir(typespath)
//DIR: resolvers
CreateDir(resolverspath)

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
