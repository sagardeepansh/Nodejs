
const express = require('express');
const con= require("./config");
const app = express();
const {v4 : uuidv4} = require('uuid');

 
app.use(express.json());


app.get("/:id", (req, resp) => {
    
    console.log(req.params.id);
    resp.send(req.params.id);
}); 


app.get("/", (req, resp) => {
    con.query("SELECT * FROM employees", (err, result) => {
        if(err){
            resp.send(err);
        }else{
            resp.send(result);
        }
    })
    const userId = uuidv4()
    console.log(req.headers.authorization);
    console.log(userId);

}); 

app.post("/", (req, resp) => {
    console.log(req.body);

    let userDetails = {
        first_name : req.body.first_name,
        last_name  : req.body.last_name,
        birth_date  : req.body.birth_date,
        gender  : req.body.gender,
        hire_date  : req.body.hire_date
    };

    con.query("INSERT INTO employees (birth_date, first_name, last_name, gender, hire_date) VALUES ('"+userDetails.birth_date+"', '"+userDetails.first_name+"', '"+userDetails.last_name+"', '"+userDetails.gender+"', '"+userDetails.hire_date+"')", (err, result) => {
        if(err){
            resp.send(err);
        }else{
            resp.send(result);
        }
    })
    
});

app.post("/login", (req, resp) => {
    var useremail = req.body.email;
    var userpassword = req.body.password;
    var encopass = Buffer.from(userpassword).toString('base64');

    con.query("SELECT * FROM `user` WHERE  pass = '"+encopass+"' AND  `emailid` = '"+useremail+"'", (err, result) => {
        if(err){
            resp.send(err);
        }else{
            resp.send(result);
        }
    })
    console.log(req.body);
    // resp.send(req.body);
});

app.listen(5000)