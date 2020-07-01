const fs = require('fs');
module.exports = function (path, generator, param, name) {
    fs.writeFile(path, generator(param),
        (err) => {
            if (err) return console.log(err);
            console.log(name + ' OK: ' + path);
        })
}
