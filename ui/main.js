const express = require('express')
const app = express()
app.use(express.json())
const fs = require('fs')
const {execSync} = require("child_process");
const path  = require('path')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type');
    next();
})





app.get("/status", (req, res) => {
    res.send('RUN')
})

app.get("/load/:modulename", async (req, res) => {
    let fileName = '../input/source_' + req.params.modulename.toLowerCase() + '.json'
    console.log(fileName)
    res.json(require(fileName))
})

app.post("/save", (req, res) => {

    let fileName = './input/source_' + req.body.module.toLowerCase() + '.json'
    fs.writeFile(fileName, JSON.stringify(req.body),
        (err) => {
            if (err) return console.log(err);
            console.log('Source save ok');
            res.json({
                status: true,
                source: JSON.stringify(req.body)
            })
        })
})

app.post("/generate", (req, res) => {

    let fileName = './input/source_' + req.body.module.toLowerCase() + '.json'

    fs.writeFile(fileName, JSON.stringify(req.body),
        (err) => {
            if (err) return console.log(err);
            console.log('Source save ok');

            let status
            let error
            let generatorBack
            let generatorFront

            let inputFileForGenerators = '../.' + fileName

            try {
                generatorBack = execSync("node src/generator-api/api-commander.js -f " + inputFileForGenerators).toString()
                generatorFront = execSync("node src/generator-front/front-commander.js -f " + inputFileForGenerators).toString()
                status = true
            } catch (e) {
                error = e
                status = false
            }

            res.json({
                status: status,
                front: generatorFront,
                back: generatorBack,
                error: (error) ? error.message : null
            })
        })
})

app.use('/', express.static('ui/web', {index: "index.html"}));



const port = 4060
app.listen(port, () => {
    console.log("UI-API Start. Port: http://localhost:" + port)
})
