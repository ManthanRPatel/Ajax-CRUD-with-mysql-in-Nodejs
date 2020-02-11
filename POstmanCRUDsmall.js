const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

var app = express();  // configure express server
app.use(bodyparser.json());

//mysql details
var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database: 'learners',
    multipleStatements: true
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


//Creating GET Router to fetch all the learner details from the MySQL Database
app.get('/learners' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails', (err, rows, fields) => {
    if (!err){
    res.send(rows);}
    else{
    console.log(err);}
    })
    } );

//Router to GET specific learner detail from the MySQL database
app.get('/learners/:id' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails WHERE learner_id = ?',[req.params.id], (err, rows, fields) => {
    if (!err){
    res.send(rows);}
    else{
    console.log(err);}
    })
    } );


// add or insert opertaion
app.post('/_insert', (req, res) => {
    let learner = req.body;
    console.log(learner);
    var sql = "INSERT INTO learnerdetails (learner_name,learner_email,course_Id) values (?,?,?)";
    mysqlConnection.query(sql, [learner.learner_name, learner.learner_email, learner.course_Id], (err, rows, fields) => {
        if (!err){
        res.send('New Learner Details added Successfully');}
        else{
        console.log(err);}
    });
});


/// Update operation
app.put('/learners',(req,res)=>{
    let learner = req.body;
    console.log(learner);
    var sql = "UPDATE learnerdetails SET learner_name = ? , learner_email = ? , course_Id = ? WHERE learner_id = ? ";
    mysqlConnection.query(sql,[learner.learner_name,learner.learner_email,learner.course_Id,learner.learner_id],(err,rows,fields) => {
        if(!err){
        res.send("Learner Updates Successfully !!!");}
        else{
        console.log(err);}
    });
});

// delete data using id
app.delete('/learners/:id', (req, res) => {
    mysqlConnection.query("DELETE FROM learnerdetails WHERE learner_id = ?",[req.params.id] , (err, rows, fields) =>{
        if(!err){
        res.send("Learners record deleted successfully..");}
        else{
        console.log(err);}
    });
});
