var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var moment = require('moment');

var options = {
    host: '172.21.56.101',
    user: 'root',
    password: 'adv2389',
    database: 'adv-as'
};


var pool  = mysql.createPool(options);
//
//pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//  if (error) throw error;
//  console.log('The solution is: ', results[0].solution);
//});



//var connection = mysql.createConnection(options);
// init contect db
//connection.connect();

setInterval(function () {

    //console.log(moment());
    var start = moment('1930', 'h:mm');
    var stop = moment('2354', 'h:mm');

//    console.log(start.format()+" "+stop.format()+ "pzrerwa nocna");
    if (moment().isBetween(start, stop)) {

//        if (connection.state === 'authenticated') {
//            connection.end();
//        }
       //  console.log("przerwa");
    } else {
      //  console.log(' baza dziala');

//        if (connection.state === 'disconnected') {
//            connection = mysql.createConnection({
//                host: '172.21.56.101',
//                user: 'root',
//                password: 'adv2389',
//                database: 'adv-as'
//            });
//            connection.connect();
//        }
    }
}, 3000);


router.get('/', function (request, response, next) {

    pool.query("SELECT * FROM event, ff_email, room WHERE ff_email.id = event.idUser and event.status != 'end' and event.status != 'endend' and room.idRoom = event.idRoom", function (err, rows, fields) {
        if (!err) {
            response.send(rows);
        } else
            console.log('Error while performing Query.');
    });

});


router.post('/statusEnd', function (request, response, next) {

    var event = request.body.idEvent;

    pool.query("UPDATE event SET status='end' where idEvent=" + event);
next();

});

router.post('/statusEndEnd', function (request, response, next) {

    pool.query("UPDATE event SET status='endend' where status ='end'");

next(); 
});

module.exports = router;
