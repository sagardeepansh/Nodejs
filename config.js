const mysql = require('mysql');
const con= mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12668728",
    password: "9tlvrXasUm",
    database: "sql12668728"
})
con.connect((err)=>{
    if(err){
        console.warn("error is connection");
    }
})

module.exports = con;