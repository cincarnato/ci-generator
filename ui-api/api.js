const express = require('express')
const app = express()
app.use(express.json())
const fs = require('fs')
const {execSync } = require("child_process");

app.use( (req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type');
    next();
})

app.get("/status",(req,res)=>{res.send('RUN')})

app.get("/load/:modulename",async (req,res)=>{
    let fileName = '../input/source_'+req.params.modulename.toLowerCase()+'.json'
    console.log(fileName)
    res.json(require(fileName))
 /*   fs.readFile(fileName, 'utf8', (err, data)=>{
        if(err){
            console.error(err)
        }
        console.log(data)
        res.json(data)
    });*/

})

app.post("/save",(req,res)=>{

    let fileName = './input/source_'+req.body.module.toLowerCase()+'.json'
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

app.post("/generate",(req,res)=>{
    {}
    let fileName = './input/source_'+req.body.module.toLowerCase()+'.json'

    fs.writeFile(fileName, JSON.stringify(req.body),
        (err) => {
            if (err) return console.log(err);
            console.log('Source save ok');

            let error
            let generatorBack
            let generatorFront

            try{
                generatorBack = execSync("node api-commander.js -f "+ fileName).toString()
                generatorFront = execSync("node FrontComanderOld.js -f "+ fileName).toString()
            }catch (e) {
               error = e
            }

            res.json({
                status: true,
                front:generatorFront,
                back: generatorBack,
                error: (error)?error.message:null
            })
        })
})

app.listen(4060,()=>{console.log("UI-API Start")})
