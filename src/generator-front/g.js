const GeneratorManager = require('./FrontGeneratorManager')

const commander = require('commander');
commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-f, --file <file>', 'Set the source file')
    .parse(process.argv);

const sourceFile = (commander.file ? commander.file : '../../input/source.json');
const source = require(sourceFile)

let gm = new GeneratorManager(source)

//console.log(gm.source)
gm.createDirs()
gm.generateI18n()
gm.generateProvider()

