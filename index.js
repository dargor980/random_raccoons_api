const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
var mysql= require('mysql');
var data= [];


// DB CONNECTION

var connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'raccoon_api'
});

connection.connect(function(error){
    if(error){
        console.error('error connecting: '+ error.stack);
        return;
    }
    console.log('Database conected as PID '+ connection.threadId);
});



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
    }catch(e){

    }
}


app.disable("x-powered-by");

let helmet = require('helmet');
app.use(helmet.hidePoweredBy());
app.use(express.static(__dirname + '/src'));
app.listen(3000, () => {
    console.log("El servidor se ha iniciado en el puerto 8000");
}); 

app.get('/', function(req, res){
    res.sendFile('src/views/index.html', {root: __dirname});
});

app.get('/raccoons/all', function(req, res){
    scanDirs('src/img/mapaches');
     connection.query('SELECT *FROM MAPACHES', function(error, results){
        if(error){
            console.error('Query Error: ' + error.stack);
        }else{
            let dato=[];
            results.forEach(element =>{
                dato.push(element.url);
            });
            return res.json(dato);
        }
    }); 
});

app.get('/raccoons/random', function(req, res){
    
    connection.query('SELECT * FROM MAPACHES ORDER BY RAND() LIMIT 1', function(error, results){
        if(error){
            console.error('Query Error: ' + error.stack);
        }else{
            return res.sendFile(results[0].url,{root: __dirname});
        }
    })
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


//this is an internal function that updates the database records.

app.post('/raccoons/update', function(req,res){
    scanDirs('src/img/mapaches');
    
    connection.query('TRUNCATE TABLE MAPACHES', function(error, results){
        if(error){
            console.error("Query Error: " + error.stack);
        }else{
            let updatedPaths=[];
            data.forEach(element =>{
                updatedPaths.push(element.path);
            });
            updatedPaths.forEach(element =>{
                connection.query('INSERT INTO MAPACHES SET url = ?',element, function(error, results){
                    if(error){
                        console.error("Query Error: " + error.stack);
                       
                    }
                })
            });
            res.send("updated directory database!")
        }
    }); 
   
   
});


