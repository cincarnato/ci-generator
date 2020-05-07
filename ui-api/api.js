const express = require('express')
const app = express()
app.use(express.json())
const fs = require('fs')
const { exec } = require("child_process");

app.use( (req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type');
    next();
})

app.get("/status",(req,res)=>{res.send('RUN')})

app.get("/load/:modulename",(req,res)=>{res.send('RUN')})

app.post("/save",(req,res)=>{
    console.log(req.body)
    let fileName = './input/source_'+req.body.module.toLowerCase()+'.json'
    fs.writeFile(fileName, JSON.stringify(req.body),
        (err) => {
            if (err) return console.log(err);
            console.log('Source save ok');

            exec("node GeneratorBack.js -f "+ fileName)
            exec("node GeneratorFront.js -f "+ fileName)
            res.send('OK')
        })
})

app.listen(4060,()=>{console.log("UI-API Start on http://localhost:4060")})
