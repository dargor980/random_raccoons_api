const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

var data= [];

function scanDirs(directoryPath){
    data=[];
    try{
        var ls=fs.readdirSync(directoryPath);
        for(let index = 0; index<ls.length; index++){
            const file = path.join(directoryPath, ls[index]);
            var dataFile = null;
            try{
                dataFile =fs.lstatSync(file);
            }catch(e){}

            if(dataFile){
                data.push({
                    path:file,
                    length: dataFile.size
                });
                if(dataFile.isDirectory()){
                    scanDirs(file)
                }
            }
        }
    }catch(e){}
}


const jsonString = JSON.stringify(data);
console.log(data);
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('src/db/raccoon_db.db', function(error) {
    if(error !=null)
    {
        console.log('Falló al abrir bd', error);
        process.exit(1);
    }
});

db.serialize(function() {
   
    db.run("CREATE TABLE MAPACHES (info TEXT)", function(error){});

    
    var stmt = db.prepare('INSERT INTO MAPACHES VALUES (?)');

    for(var i =0; i< 10; i++)
    {
        stmt.run('Ipsum' + i);
    }
    stmt.finalize();
});

db.close();

app.use(express.static(__dirname + '/src'));
app.listen(8000, () => {
    console.log("El servidor se ha iniciado en el puerto 8000");
});

app.get('/', function(req, res){
    res.sendFile('src/views/index.html', {root: __dirname});
});

app.get('/raccoons/all', function(req, res){
    scanDirs('src/img/mapaches');
    res.json(data);
});

app.get('/raccoons/random', function(req, res){
    res.send('Mapache random');
});

app.get('/raccoons/:width*:heigth', function(req,res){

});

app.get('/raccoons/fact', function(req, res){

});

app.get('/raccoons/fact/all', function(req, res){

});

app.get('/raccoons/meme', function(req, res){

});

app.get('/raccoons/meme/all', function(req, res){

});

