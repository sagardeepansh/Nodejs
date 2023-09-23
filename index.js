
const express = require('express');
const con= require("./config");
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {v4 : uuidv4} = require('uuid');
const sessions = require("express-session");
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'https://www.google.com/']
}));
// app.get("/:id", (req, resp) => {
    
//     console.log(req.params.id);
//     resp.send(req.params.id);
// }); 

const oneDay = 1000 * 60 * 60 * 24;
const sessionToken = uuidv4();
app.use(sessions({
    secret: sessionToken,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// const checkLogin =(para)=> {
//     var result = false;
//     if(para.session.user){
//         var sessionuser = para.session.user;
//         var sessionuser = sessionuser.token;
//         var BearerA = para.headers.authorization.replace("Bearer","");
//         var BearerA = BearerA.replace(" ","");
//         // console.log(sessionuser.token);
//         // console.log(BearerA);
//         if(sessionuser==BearerA){
//             var result = true;
//         }
//     }
//     return result;
// }

app.get("/", (req, resp) => {
    con.query("SELECT * FROM employees", (err, result) => {
        if(err){
            resp.send(err);
        }else{
            resp.send(result);
        }
    })
    console.log(req.headers.authorization);
}); 

// app.post("/", (req, resp) => {
//     console.log(req.body);

//     let userDetails = {
//         first_name : req.body.first_name,
//         last_name  : req.body.last_name,
//         birth_date  : req.body.birth_date,
//         gender  : req.body.gender,
//         hire_date  : req.body.hire_date
//     };

//     con.query("INSERT INTO employees (birth_date, first_name, last_name, gender, hire_date) VALUES ('"+userDetails.birth_date+"', '"+userDetails.first_name+"', '"+userDetails.last_name+"', '"+userDetails.gender+"', '"+userDetails.hire_date+"')", (err, result) => {
//         if(err){
//             resp.send(err);
//         }else{
//             resp.send(result);
//         }
//     })
    
// });

app.post("/login", (req, resp) => {
    var useremail = req.body.username;
    var userpassword = req.body.password;
    var encopass = Buffer.from(userpassword).toString('base64');
    // var sdfdsf ="SELECT * FROM `user` WHERE  pass = '"+encopass+"' AND  `emailid` = '"+useremail+"'";
    // console.log(sdfdsf);
    con.query("SELECT * FROM `user` WHERE  pass = '"+encopass+"' AND  `emailid` = '"+useremail+"'", (err, result) => {
        // console.log(result);
        if(err){
            console.log(err);
            resp.send({"msg": "Error please contact dev"});
        }else if(Boolean(result[0])){
            // const userToken = uuidv4();
            console.log(sessionToken)
            var returnData = {
                "msg": "success",
                "status": 200,
                "token": sessionToken,
                "userDetails": result
            }
            // const user = {
            //     "id": result[0].id,
            //     "token": sessionToken
            // };
            // req.session.user = user;
            // req.session.save();
            var updateQ = "UPDATE `user` SET `token`='"+sessionToken+"' WHERE id="+""+result[0].id+"";
            con.query(updateQ, (errr, resultt) => {
                if(err){
                    resp.send(errr);
                }else{
                    // resp.send(resultt);
                } 
            })
            // resp.cookie(`token`,userToken,{
            //     maxAge: 50000,
            //     // expires works the same as the maxAge
            //     expires: new Date('01 12 2021'),
            //     secure: true, // change true when project go live
            //     httpOnly: true, // change true when project go live
            //     sameSite: 'lax'
            // });
            resp.send(returnData);
           
        }else{
            // console.log(result);
            resp.send({
                "msg": "invalid",
                "status": 401,
            });
        }
    });
    console.log(req.body);
});

app.get("/user", (req, res) => {
    // const checkLOgin = checkLogin(req);
        var result ="sadsadasd";
    res.send(result);
});

app.get("/test", (req, resp) => {
    resp.sendStatus(404);
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


app.get("/cookie", (req, resp) => {
    const userToken = uuidv4();
    resp.cookie(`token`,userToken,{
        maxAge: 50000,
        // expires works the same as the maxAge
        expires: new Date('01 12 2021'),
        // secure: false, // change true when project go live
        // httpOnly: false, // change true when project go live
        // sameSite: 'lax'
    });
    resp.send("d");
});

app.get('*', (req, resp) => {
    resp.send("404 not found");
});


app.listen(5000)