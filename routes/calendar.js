/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (request, response) {
    
    response.render('calendar');
    
});

module.exports = router;






