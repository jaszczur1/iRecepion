/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var router = express.Router();


var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '172.21.56.101',
    user: 'root',
    password: 'adv2389',
    database: 'adv-as'
});

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host: '172.21.56.101',
    user: 'root',
    password: 'adv2389',
    database: 'adv-as',
    debug    :  false
});

function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

router.post('/', function (request, response, next) {

    connection.query("SELECT * FROM event, ff_email, room WHERE ff_email.id = event.idUser and event.status != 'end' and event.status != 'endend' and room.idRoom = event.idRoom", function (err, rows, fields) {
        if (!err) {
            response.send(rows);
        } else
            console.log('Error while performing Query.');
    });


});


router.post('/statusEnd', function (request, response, next) {

             var event =  request.body.idEvent;

               connection.query("UPDATE event SET status='end' where idEvent="+event);

});

router.post('/statusEndEnd', function (request, response, next) {

               connection.query("UPDATE event SET status='endend' where status ='end'");

});



module.exports = router;
