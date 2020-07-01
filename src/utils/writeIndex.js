const fs = require('fs');

const indexGenerator = function(name){
    let content =
`import ${name} from './${name}'
export {${name}}
export default ${name}
`
    return content
}

module.exports = function (dirPath, name) {
    let finalPath = dirPath + 'index.js'
    fs.writeFile(finalPath, indexGenerator(name),
        (err) => {
            if (err) return console.log(err);
            console.log('Index of ' + name + ' OK: ' + finalPath );
        })
}
