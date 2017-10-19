var outlook = require('node-outlook');
var authHelper = require('../authHelper');
outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

var getActualTime = require('../node_modules/moment'); //lib for format time

var express = require('express');
var router = express.Router();

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

    if (Verror !== "ok") {
        //    response.send("podczas pracy wystapił błąd sieci lub brak sieci");

        var json = JSON.stringify({
            "message": "podczas pracy wystapił błąd sieci lub brak sieci"
        });
        response.send(json);
        // amoutErrors = 0;

    }
    //pobieranie z ciasteczka
    if (bool) {
        token = request.cookies.token;
        expiration = new Date(parseFloat(request.cookies.token_expires));
        refresh_token = request.cookies.refresh_token;
        console.log("Get request all cookies :" + request.headers.cookie);
        bool = false;
        console.log("work with this mail: " + request.cookies.email);

        // jesli wystąpi błąd
        token_refreh_pom = refresh_token;
    }

    console.log('Request handler \'mail\' was called.');
    // response.json({"blad_strony":"przeladuj strone"});

    getAccessToken(request, response, function (error, refershTokenPom) {

        if (error) {
            console.log("bład tokena do obsłuzenia");
            refresh_token = refershTokenPom;   /// tu trzeba poprawić
        }
    });

    function getAccessToken(request, response, callback) {

        console.log("czaswygasniecia : " + expiration);
        console.log("aktualny czas : " + new Date());

        // refresh token
        if (expiration <= new Date()) {
            console.log('TOKEN EXPIRED, REFRESHING');
            authHelper.refreshAccessToken(refresh_token, function (error, newToken) {

                console.log(newToken);

                if (error) {
                    // ile błędów
                    amoutErrors++;
                    console.log(amoutErrors);


                    if (amoutErrors > 50) {
                        Verror = error;
                    }

                    console.log('bład nowego tokena: ' + error);
                    callback(error, token_refreh_pom);

                } else if (newToken) {
                    Verror = "ok";
                    amoutErrors = 0;

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

                    // jesli czas sie skończy to użyj tego
                    token_refreh_pom = newToken.token.refresh_token;

                }
            })
        } else {
            console.log("bez odswierzania token");
        }
    }
    response.end();

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
                    var json = JSON.stringify({
                        "message_notSend": "mail nie wyslany"
                    });
                    response.send(json);

                } else if (result) {
                    console.log(JSON.stringify(result, null, 2));
                    //  response.json({"blad_strony": "mailSend"});
                    Verror = "ok";
                }
                response.end();
            });
}
);
router.get('/getCalendarFromEvent', function (request, response, next) {

    var userInfo = {
        email: 'APSC.iReception@advantech.com'
    };

    console.log(" mój czas :" + getActualTime().format("YYYY-M-D"));
    var startDateTime = getActualTime().format("YYYY-M-D");
    var endDateTime = getActualTime().format("YYYY-M-D");
    
    var apiOptions = {
        token: token,
        // If none specified, the Primary calendar will be used
        user: userInfo,
        startDatetime: startDateTime,
        endDatetime: endDateTime
    };

    outlook.calendar.syncEvents(apiOptions, function (error, events) {
        if (error) {
            console.log('syncEvents returned an error:', error);
        } else {

            try {
                response.json(events);
            console.log(events.value[0].Start);
            console.log(events.value[0].End);
            console.log(events.value[0].Location);
//            console.log(events.value[0].End);
//            console.log(events.value[0].Organizer);
//            
//            console.log('/////////////////////////////////////////////////////');

            } catch (e) {
                console.log("brak zdarzen w kalenarzu " + e)
            }

            // Do something with the events.value array
            // Then get the @odata.deltaLink
            //  var delta = messages['@odata.deltaLink'];

            // Handle deltaLink value appropriately:
            // In general, if the deltaLink has a $skiptoken, that means there are more
            // "pages" in the sync results, you should call syncEvents again, passing
            // the $skiptoken value in the apiOptions.skipToken. If on the other hand,
            // the deltaLink has a $deltatoken, that means the sync is complete, and you should
            // store the $deltatoken value for future syncs.
            //
            // The one exception to this rule is on the intial sync (when you call with no skip or delta tokens).
            // In this case you always get a $deltatoken back, even if there are more results. In this case, you should
            // immediately call syncMessages again, passing the $deltatoken value in apiOptions.deltaToken.
        }
    });
});

//https://github.com/jasonjoh/node-outlook/blob/master/reference/node-outlook.md
// instrukcja jest takze node_modules

module.exports = router;