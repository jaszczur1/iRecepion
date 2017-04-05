var outlook = require('node-outlook');
var authHelper = require('../authHelper');

var express = require('express');
var router = express.Router();

var expiration;
var refresh_token;
var token;
var token_expires;
var mail;


var bool = true;

/* GET home page. */
router.get('/', function (request, response, next) {

    console.log('Request handler \'mail\' was called.');
    console.log("work with this mail: " + request.cookies.email);

    token = request.cookies.token;
    console.log("get first token form authorize page " + token);

    outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

    getAccessToken(request, response, function (cookiesArrray, newAccessToken) {

        token = getValueFromCookie("token", cookiesArrray.toString());
        refresh_token = getValueFromCookie("refresh_token", cookiesArrray.toString());
        token_expires = getValueFromCookie("token_expires", cookiesArrray.toString())
        console.log("new refersh " + token_expires);
        expiration = token_expires;

//        console.log(getValueFromCookie("refresh_token", cookiesArrray.toString()));   
//        response.cookie('refresh_token',getValueFromCookie("refresh_token", cookiesArrray.toString()));
//        response.cookie('token_expires', getValueFromCookie("token_expires", cookiesArrray.toString()));
//        console.log("token expiries "+request.cookies.token_expires);

        //   sendMail(token);
        console.log("token  po reresh'u");
    });


    function getAccessToken(request, response, callback) {

        if (bool) {
            expiration = new Date(parseFloat(request.cookies.token_expires));
            bool = false;
            mail = request.cookies.mail;
        }

        console.log("Get request all cookies :" + request.headers.cookie);
        console.log("check cookies " + expiration + " " + new Date());

        if (expiration <= new Date()) {
            // refresh token

            console.log('TOKEN EXPIRED, REFRESHING');
            refresh_token = request.cookies.refresh_token;

            authHelper.refreshAccessToken(refresh_token, function (error, newToken) {

                if (error) {
                    
                    response.send(error);
                    
                    callback(error, null);
                } else if (newToken) {
                    cookies = ['token=' + newToken.token.access_token,
                        'refresh_token=' + newToken.token.refresh_token,
                        'token_expires=' + newToken.token.expires_at.getTime()];

                    callback(cookies, newToken.token.access_token);
                }
            })
        } else {       
            console.log("bez odswierzania token'a");
        }
    }
    next();
}
        );

var start;
var end;

function getValueFromCookie(valueName, cookie) {
    if (cookie.indexOf(valueName) !== -1) {
        start = cookie.indexOf(valueName) + valueName.length + 1;
        end = cookie.indexOf(';', start);
        end = end === -1 ? cookie.length : end;
        return cookie.substring(start, end);
    }
}
var host;
var message;
var titleEventObiect;

router.get('/mail', function (request, response, next) {

    host = request.param('host');
    message = request.param('message');
    titleEventObiect = request.param('titleEventObiect');


console.log(host+" "+ message +" "+ titleEventObiect);
    console.log(titleEventObiect);

    var newMsg = {
        Subject: titleEventObiect,
        Importance: 'Low',
        Body: {
            ContentType: 'HTML',
            Content: message,
        },
        ToRecipients: [
            {
                EmailAddress: {
                    Address: host
                }
            }
        ]
    };

// Pass the user's email address
    var userInfo = {
        email: mail
    };

    outlook.mail.sendNewMessage({token: token, message: newMsg, user: userInfo},
            function (error, result) {
                if (error) {
                    console.log('sendNewMessage returned an error: ' + error);

                } else if (result) {
                    console.log(JSON.stringify(result, null, 2));
                }
            });
            next();
            
}
);
module.exports = router;