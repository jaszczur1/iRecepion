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
// czy wystpił bład
var Verror = "ok";
// czy wystapił bład po raz drugi
//var VerrorBool = false;
var amoutErrors = 0;


router.get('/', function (request, response, next) {

    if (Verror !== "ok")
        response.json({"blad_strony": "podczas pracy wystapił błąd sieci brak sieci"});

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
    // response.json({"blad_strony":"przeladuj strone"});


    getAccessToken(request, response, function (error, refershTokenPom) {

        if (error) {
            console.log("bład tokena do obsłuzenia");
            console.log('przeładuj storne');
            refresh_token = refershTokenPom;   /// tu trzeba poprawić
            return;
        }
    });

    function getAccessToken(request, response, callback) {


        console.log("czaswygasniecia : " + expiration);
        console.log("aktualny czas : " + new Date());

        // refresh token
        if ( expiration <= new Date() ) {
            console.log('TOKEN EXPIRED, REFRESHING');
            authHelper.refreshAccessToken(refresh_token, function (error, newToken) {

                console.log(newToken);

                if (error) {
                    // ile błędów
                    amoutErrors++;
                    console.log(amoutErrors);
                    

                    if (amoutErrors >= 50) {
                        Verror = error;
                        return;
                    }
                    console.log('bład nowego tokena: ' + error);
                    callback(error, token_refreh_pom);
                  
                } else if (newToken) {
                    Verror = "ok";

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
            console.log("bez odswierzania token");

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
                    Verror = error;
                    // response.json({"blad_strony":"przeladuj_strone"+error});

                } else if (result) {
                    console.log(JSON.stringify(result, null, 2));
                 //   response.json({"blad_strony": "mailSend"});
                    Verror = "ok";
                }
            });
    next();
}
);

module.exports = router;