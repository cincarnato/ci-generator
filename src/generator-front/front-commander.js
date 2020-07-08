const FrontGeneratorManager = require('./FrontGeneratorManager')

const commander = require('commander');
commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-f, --file <file>', 'Set the source file')
    .parse(process.argv);

const sourceFile = (commander.file ? commander.file : '../../input/source.json');
const source = require(sourceFile)

let gm = new FrontGeneratorManager(source)

//console.log(gm.source)
gm.createDirs()
gm.generateI18n()
gm.generateRoutes()
gm.generateProviders()
gm.generatePages()
gm.generateForm()
gm.generateFormCombos()
gm.generateCreate()
gm.generateUpdate()
gm.generateDelete()
gm.generateShowData()
gm.generateShow()
gm.generateList()
gm.generateCrud()
gm.generateGqlAll()
gm.generateGqlById()
gm.generateGqlPaginate()
gm.generateGqlCreate()
gm.generateGqlUpdate()
gm.generateGqlDelete()
gm.generateGqlFetchBySomething()