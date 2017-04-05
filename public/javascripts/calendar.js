var auditorium = [];
auditorium = ["Orange ground floor",
    "Green 1st floor",
    "Blue 2nd floor",
    "Logistics",
    "Reception",
    "Undefiled"];
var color = [];
color = ['orange', 'green', 'blue', 'pink', 'brown', 'blue'];
function createCalnedar(minTime, maxTime) {

    $('#calendar').fullCalendar({
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        aspectRatio: 2,
        defaultView: 'timelineDay',
        minTime: minTime,
        maxTime: maxTime,
        header: false, // ustawienia button
        header: {left: 'title', right: ''},
        firstDay: 1,
        //    nowIndicator: true,

        eventRender: function (event, eventElement) {

            alert(moment(event.end));

            if (event.titleEventObiect == "Rajskie smaki" || event.titleEventObiect == "Pan kanapka") {

                
                    eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div><div class='icons'><span class='glyphicon glyphicon-cutlery'></span></div></div>");
                }
               
            
            if (event.titleEventObiect == "Szkolenie") {
                
                if (moment(event.end) - moment(event.start) < 270000 || moment(event.end) - moment() < 270000) {
                    alert('todo');
                    eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
                }
                
                if (moment(event.end) - moment(event.start) > 2700000){
                    eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + '<br>' + event.titleObiect + "</div><div class='icons'><span class='glyphicon glyphicon-education'></span></div></div>");
                    alert('to');    
                }
                
            }

            if (event.titleEventObiect == "Wizyta klienta") {


                if (moment(event.end) - moment(event.start) > 2700000)
                    eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + '<br>' + event.titleObiect + "</div><div class='icons'><span class='glyphicon glyphicon-user'></span></div></div>");

                else if (moment(event.end) - moment(event.start) > 2700000 || moment(event.end) - moment() < 2700000) {

                    eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
                }

            }


            if (event.titleEventObiect == "Spotkanie") {


                if (moment(event.end) - moment(event.start) > 2700000)
                    eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + '<br>' + event.titleObiect + "</div><div class='icons'><span class='glyphicon glyphicon-blackboard'></span></div></div>");
                else if (moment(event.end) - moment(event.start) > 2700000 || moment(event.end) - moment() < 2700000) {

                    eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
                }
            }
        },

        eventClick: function (calEvent, jsEvent, view) {



            //send mail
            $.ajax({//typ połączenia na post
                url: "/getToken/mail",

                data: {
                    host: calEvent.mail, // from event object           
                    titleEventObiect: calEvent.titleEventObiect,
                    message: calEvent.titleObiect
                },
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                }
            });


            $.notify("Powiadomienie  zostało wysłane czekaj w recepcji", {
                animate: {
                    enter: 'animated bounceInDown',
                    exit: 'animated bounceOutUp'
                },
                offset: {
                    x: 600,
                    y: 400

                },
            });

            $(this).css('background-color', 'red');
            $(this).css('border-color', 'red');
        },
        resources: [
            {id: '1', title: 'Orange ground floor', eventColor: 'orange'},
            {id: '2', title: 'Green 1st floor', eventColor: 'green'},
            {id: '3', title: 'Blue 2nd floor', eventColor: 'blue'},
            {id: '4', title: 'Logistic', eventColor: 'pink'},
            {id: '5', title: 'Reception', eventColor: 'brown'}
        ]
    });
}

// fukcja tylko dla calenarza z pomieszczeniami
function formatDate(parm) {

    if (parm === "timeCreateStart") {
        return moment().format('HH') + ':00';
    }
    if (parm === "timeCreateStop") {
        return moment().add(4, 'hours').format('HH') + ':00';
    }
    if (parm === "check") {
        return moment().format('HH');
    }

}
function compareTime(givenTime) {

    var m = moment();
    if (m < moment(givenTime))
        return true;
    return false;
}
var renderEvents = function () {

    // get event from database
    $.ajax({
        type: "POST", //typ połączenia na post
        url: "/dataFromRemoteSql",
        dataType: 'json', //ustawiamy typ danych na json

        success: function (json) {

            for (var i = 0; i < json.length; i++) {

                if (compareTime(json[i].timeEventStop) === false) {

                    $.ajax({
                        type: "POST", //typ połączenia na post
                        url: "/dataFromRemoteSql/statusEnd",
                        dataType: 'json',
                        data: {
                            idEvent: json[i].idEvent
                        }
                    });
                }



                $('#calendar').fullCalendar('addEventSource', [{
                        resourceId: json[i].idRoom,
                        titleObiect: json[i].titleEvent + "<br>" + json[i].full_name,
                        start: json[i].timeEventStart,
                        end: json[i].timeEventStop,
                        color: color[json[i].idRoom - 1],
                        mail: json[i].mail,
                        titleEventObiect: json[i].type_meeting

                    }]);
            }
        }
    });

    $('#calendar').fullCalendar('addEventSource', [{
            resourceId: 5,
            titleEventObiect: "Rajskie smaki",
            start: '9:30', // a start time (10am in this example)
            end: '10:00', // an end time (6pm in this example)
            dow: [1, 2, 3, 4, 5], // Repeat monday and friday
            mail: "Employee.APL@advantech.eu"
        }]);
    $('#calendar').fullCalendar('addEventSource', [{
            resourceId: 5,
            titleEventObiect: "Pan kanapka",
            start: '10:00', // a start time (10am in this example)
            end: '10:30', // an end time (6pm in this example)
            dow: [1, 2, 3, 4, 5], // Repeat monday and friday
            mail: "Employee.APL@advantech.eu"
        }]);
}

var deleteEvent = function () {

    $('#calendar').fullCalendar('removeEvents');
}


var functionToExecute = function () {
    deleteEvent();
    renderEvents();

    date = new Date();
    console.log(date.getHours() + " " + date.getMinutes() + " " + date.getSeconds());
    if (date.getHours() !== 0 && date.getMinutes() === 0 && date.getSeconds() < 4) {




        $('#calendar').fullCalendar('destroy');
        if (formatDate('check') > 7 && formatDate('check') < 20) {

            createCalnedar(formatDate('timeCreateStart'), formatDate('timeCreateStop'));
            var calHeight = $(window).height() * 0.606;
            $('#calendar').fullCalendar('option', 'height', calHeight);
        }
    }

    if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() < 3) {


        // end end event 
        console.log('start function');
        $.ajax({
            type: "POST", //typ połączenia na post
            url: "/dataFromRemoteSql/statusEndEnd",

        });

        setTimeout(function () {
            location.reload();
        }, 5000);

    }

}



// init calendar 
createCalnedar(formatDate('timeCreateStart'), formatDate('timeCreateStop'));

// init event
renderEvents();

setInterval(functionToExecute, 3000);

// init token
$.ajax({
    type: 'GET',
    url: '/getToken'
});


$(window).resize(function () {
    var calHeight = $(window).height() * 0.606;
    $('#calendar').fullCalendar('option', 'height', calHeight);
});
var calHeight = $(window).height() * 0.606;
$('#calendar').fullCalendar('option', 'height', calHeight);

//       console.log($('#calendar').width());
//       console.log($('#calendar').height());
//       console.log($( window ).width());
//       console.log($( window).height());

