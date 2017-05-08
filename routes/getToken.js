var outlook = require('node-outlook');
var authHelper = require('../authHelper');

var express = require('express');
var router = express.Router();
outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

var expiration;
var refresh_token;
var token;
var bool = true;
var token_refreh_pom;

/* GET home page. */
router.get('/', function (request, response, next) {
    
      //pobieranie z ciasteczka
        if (bool) {
            token = request.cookies.token;
            expiration = new Date(parseFloat(request.cookies.token_expires));
            refresh_token = request.cookies.refresh_token;
            console.log("Get request all cookies :" + request.headers.cookie);
            bool = false;
            console.log("work with this mail: " + request.cookies.email);
    }
    
    console.log('Request handler \'mail\' was called.');
    getAccessToken(request, response, function (error, refershTokenPom) {

        if (error) {
            console.log("bład tokena do obsłuzenia");
            console.log('przeładuj storne');
            refresh_token = refershTokenPom;
            return;
        }
    });

    function getAccessToken(request, response, callback) {
        
        console.log("czaswygasniecia : "+ expiration); 
        console.log("aktualny czas : "+ new Date());

        // refresh token
        if ( expiration <= new Date() ) {
            console.log('TOKEN EXPIRED, REFRESHING');
            authHelper.refreshAccessToken(refresh_token, function (error, newToken) {

                console.log(newToken);
                
                if (error) {
                    res.redirect('http://localhost:8000');
                    console.log('bład nowego tokena: ' + error);
                    callback(error, token_refreh_pom );
                    return;
                } else if (newToken) {

                    if (token !== newToken.token.access_token) {
                        console.log("nowy glowny token");
                    }
                    if (refresh_token !== newToken.token.refresh_token) {
                        console.log("nowy refresh token");
                    }
                    token = newToken.token.access_token;
                    expiration = newToken.token.expires_at;
                    expiration = new Date(expiration);
                    console.log(expiration);
                    
                    
                  //  expiration = new Date(parseFloat(token_expires));
                    // callback(null, newToken.token.access_token);
                    token_refreh_pom = newToken.token.refresh_token;
                    
//                    // po wygasnieciu lock wykonuje sie raz
//                    if (refersh_RefreshToken === true) {
//                        refresh_token = newToken.token.refresh_token;
//                     //   refresh_token = newToken.token.refresh_token;
//                        //('token wygasł');
//                       refersh_RefreshToken = false;
//                    }
                }  
            })
        } else {
            console.log("bez odswierzania token'a");
        }
    }
    next();
});

router.get('/mail', function (request, response, next) {

    var host = request.param('host');
    var message = request.param('message');
    var titleEventObiect = request.param('titleEventObiect');

    console.log('uzywam tego tokena' + token);

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
        email: 'APSC.iReception@advantech.com'
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