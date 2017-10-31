var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var options = {
    host: '172.21.56.101',
    user: 'root',
    password: 'adv2389',
    database: 'adv-as'
};


var pool = mysql.createPool(options);

router.get('/', function (request, response, next) {

    pool.query("SELECT * FROM event, ff_email, room WHERE ff_email.id = event.idUser and event.status != 'end' and event.status != 'endend' and room.idRoom = event.idRoom", function (err, rows, fields) {
        if (!err) {
            
            response.json(rows);
            if(rows === null) console.log('lack events');

        } else {
            console.log('failed db');
            
           
             response.status(500).send("Not found.");
        }
    });
});


router.post('/statusEnd', function (request, response, next) {

    var event = request.body.idEvent;

    pool.query("UPDATE event SET status='end' where idEvent=" + event);
    response.end();

});

router.post('/statusEndEnd', function (request, response, next) {

    pool.query("UPDATE event SET status='endend' where status ='end'");
    response.end();
});

module.exports = router;
