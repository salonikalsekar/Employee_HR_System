var express =  require('express');
var bodyParser = require('body-parser');


var employees = require('./routes/employees');

var port = 3000

var app= express();

//setting cors
app.use((eq, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', );
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use('/employee', employees);

app.listen(port, function(){
    console.log("Server started on " + port)
})