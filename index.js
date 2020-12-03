const express = require('express');
const app = express();
app.use(express.static(__dirname + '/src'));
app.listen(3000, () => {
    console.log("El servidor se ha iniciado en el puerto 3000");
});

app.get('/', function(req, res){
    res.sendFile('src/views/index.html', {root: __dirname});
});

app.get('/raccoons/all', function(req, res){

});

app.get('/raccoons/random', function(req, res){

});

