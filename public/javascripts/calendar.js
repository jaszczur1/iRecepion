var message_data = "";
var auditorium = [];
auditorium = ["Orange ground floor",
    "Green 1st floor",
    "Blue 2nd floor",
    "Logistics",
    "Reception",
];

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
        eventRender: function (event, eventElement) {


//          /  alert(event.end);
//            
//            moment().isSameOrAfter(moment().add(1, 'day')); // false

//                moment('2010-10-20').isSame('2010-10-20'); 
//              if( alert('trur');

            if (event.titleEventObiect == "Rajskie smaki" || event.titleEventObiect == "Pan kanapka" || event.titleEventObiect == "Pan pobudka") {

                $(eventElement).css({'font-size': '17px'});
                eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div><div class='icons'><span class='glyphicon glyphicon-cutlery'></span></div></div>");
            } else {

                if (moment(event.end) - moment(event.start) <= 1800000 || moment() - moment(event.end) <= 1800000) {

                    $(eventElement).css({'font-size': '17px', 'display': 'flex'});

//            if (event.titleEventObiect == "Rajskie smaki" || event.titleEventObiect == "Pan kanapka") {

                    eventElement.append("<div><div>" + event.titleEventObiect + "</div><div class='icons'><span class='glyphicon glyphicon-user'></span></div></div>");

                } else {

                    $(eventElement).css({'font-size': '25px', 'display': 'flex'});

//            if (event.titleEventObiect == "Rajskie smaki" || event.titleEventObiect == "Pan kanapka") {

                    eventElement.append("<div>" + event.titleEventObiect + "</div> <div style ='font-size :50px; position: realtive; margin-top :10px; margin-left: 10px'><span class='glyphicon glyphicon-user'></span></div>");


                }

            }



//            }
//
//            if (event.titleEventObiect == "Szkolenie") {
//
//
//                if (moment(event.end) - moment(event.start) < 2700000) {
//                    eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
//                } else {
//
//                    if (moment(event.end) - moment() <= 1800000) {
//
//                        eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
//                    } else {
//                        eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + '<br>' + event.titleObiect + "</div><div class='icons'><span class='glyphicon glyphicon-education'></span></div></div>");
//                    }
//                }
//            }
//
//
//            if (event.titleEventObiect == "Wizyta klienta") {
//
//                if (moment(event.end) - moment(event.start) < 2700000) {
//
//                    eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
//
//                } else {
//
//                    if (moment(event.end) - moment() <= 1800000) {
//                        eventElement.append("<div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + "</div>");
//
//                    } else {
//                        eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + '<br>' + event.titleObiect + "</div><div class='icons'><span class='glyphicon glyphicon-user'></span></div></div>");
//                    }
//                }
//
//            }
//
//
//            if (event.titleEventObiect == "Spotkanie") {
//
//                if (moment(event.end) - moment(event.start) < 2700000) {
//
//                    //  alert('maly element');
//                    eventElement.append('<div class="icons"><span class="glyphicon glyphicon-cutlery"></span></div>');
//                } else {
//
//                    if (moment(event.end) - moment() <= 1800000) {
//                        eventElement.append('<div class="icons"><span class="glyphicon glyphicon-cutlery"></span></div>');
//                    } else {
//                        eventElement.append("<div><div class='text' style= 'float: left'; margin-right:20px;>" + event.titleEventObiect + '<br>' + event.titleObiect + "</div><div class='icons'><span class='glyphicon glyphicon-blackboard'></span></div></div>");
//
        },
        eventClick: function (calEvent, jsEvent, view) {


            // request send mail
            $.ajax({//typ połączenia na post
                url: "/getToken/mail",
                type: 'GET',
                dataType: 'json',
                data: {
                    host: calEvent.mail, // from event object           
                    titleEventObiect: calEvent.titleEventObiect,
                    message: calEvent.titleObiect
                },
                success: function (data, textStatus, jqXHR) {

                    alert('send');
                    $.notify("Powiadomienie  zostało wysłane czekaj w recepcji", {
                        animate: {
                            enter: 'animated bounceInDown',
                            exit: 'animated bounceOutUp'
                        },
                        offset: {
                            x: 600,
                            y: 400

                        }, type: 'success', showProgressbar: true
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    alert('not den')
                    $.notify("Wiadomość nie wysłana .Skontaktuj sie z Krzysztofem Szczech", {

                        offset: {
                            x: 600,
                            y: 400

                        }, type: 'danger', delay: 0,

                    });
                }

            });
//            message_data = "";
//            $.ajax({
//                type: "get", //typ połączenia na get
//                url: "/getToken",
//                dataType: 'json',
//                success: function (data, textStatus, jqXHR) {
//                    alert(data);
//                }
//            });

//            if (message_data === "")



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
        type: "GET", //typ połączenia na post
        url: "/dataFromRemoteSql",
        dataType: 'json', //ustawiamy typ danych na json

        success: function (json) {

            for (var i = 0; i < json.length; i++) {
                if (compareTime(json[i].timeEventStop) === false) {

                    $.ajax({
                        type: "post", //typ połączenia na post
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
                        mail: json[i].mail,
                        titleEventObiect: json[i].type_meeting
                    }]);
            }
        }
    });

    $.ajax({
        type: "GET", //typ połączenia na GET
        url: "/getToken/getCalendarFromEvent",
        dataType: 'json', //ustawiamy typ danych na json

        success: function (json) {

            deleteEvent();

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
            $('#calendar').fullCalendar('addEventSource', [{
                    resourceId: 5,
                    titleEventObiect: "Pan pobudka",
                    start: '10:30', // a start time (10am in this example)
                    end: '11:00', // an end time (6pm in this example)
                    dow: [1, 2, 3, 4, 5], // Repeat monday and friday
                    mail: "Employee.APL@advantech.eu"
                }]);


            resourceId = 0;
            for (i = 0; i < json.value.length; i++) {
                for (j = 0; j < auditorium.length; j++) {
                    if (json.value[i].Location.DisplayName === auditorium[j]) {
                        resourceId = j + 1;
                        console.log(resourceId);
                        console.log(json.value[i].Location.DisplayName);
                        console.log(i + " " + j);
                        start = moment.parseZone(json.value[i].Start.DateTime).local().format();
                        start = moment().format(start).substring(11, 16);
                        end = moment.parseZone(json.value[i].End.DateTime).local().format();
                        end = moment().format(end).substring(11, 16);
                        title = json.value[i].Subject.toString();
                        
                        $('#calendar').fullCalendar('addEventSource', [{
                                resourceId: resourceId,
                                titleEventObiect: json.value[i].Subject + '<br>' + json.value[i].Organizer.EmailAddress.Name,
                                start: start, // a start time (10am in this example)
                                end: end, // an end time (6pm in this example)
                                mail: json.value[i].Organizer.EmailAddress.Address,

                            }]);
                        break;
                    }
                }
            }
        }});
}

var deleteEvent = function () {
    $('#calendar').fullCalendar('removeEvents');
}

var chceck_connet_internet = false;

var functionToExecute = function () {

//    // console.log(moment());
//    var start = moment('2030', 'h:mm');
//    var stop = moment('2355', 'h:mm');

    $.ajax({
        type: "get", //typ połączenia na get
        url: "/getToken",
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {

            if (chceck_connet_internet == false) {
                $.notify("Sesja wygasła lub wystąpił błąd sieci. Skontaktuj sie z Krzysztofem Szczech", {
                    offset: {
                        x: 600,
                        y: 400
                    }, type: 'danger', delay: 0,
                });
                chceck_connet_internet = true;
            }
        }, error: function (jqXHR, textStatus, errorThrown) {
            chceck_connet_internet = false;
        }
    });
    // console.log("from web site " + start + " " + stop);
//    if (!moment().isBetween(start, stop))

    renderEvents();
    date = new Date();
    console.log(date.getHours() + " " + date.getMinutes() + " " + date.getSeconds());
    if (date.getHours() !== 0 && date.getMinutes() === 0 && date.getSeconds() <= 5) {

        if (date.getHours() === 6 && date.getMinutes() === 59 && date.getSeconds() <= 10)
            location.reload();
        $('#calendar').fullCalendar('destroy');
        if (formatDate('check') > 0 && formatDate('check') < 20) {

            createCalnedar(formatDate('timeCreateStart'), formatDate('timeCreateStop'));
            var calHeight = $(window).height() * 0.606;
            $('#calendar').fullCalendar('option', 'height', calHeight);
        }
    }
    if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() <= 5) {

// end end event 
        console.log('start function');
        $.ajax({
            type: "POST", //typ połączenia na post
            url: "/dataFromRemoteSql/statusEndEnd"
        });
    }
}

// init app

$(document).ready(function () {

    // init calendar 
    createCalnedar(formatDate('timeCreateStart'), formatDate('timeCreateStop'));
// init event
    renderEvents();
// init token 
    $.ajax({

        type: "get", //typ połączenia na post
        url: "/getToken"
    });
    setInterval(functionToExecute, 5000);
    $(window).resize(function () {
        var calHeight = $(window).height() * 0.606;
        $('#calendar').fullCalendar('option', 'height', calHeight);
    });
    var calHeight = $(window).height() * 0.606;
    $('#calendar').fullCalendar('option', 'height', calHeight);

})


