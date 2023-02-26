function onSubmit() {
    var form = document.getElementById("myForm");
    var eventID = form.elements[0].value;
    var eventName = form.elements[1].value;
    var location = form.elements[2].value;
    var timeZone = form.elements[3].value;
    var startTimeDate = form.elements[4].value;
    var endTimeDate = form.elements[5].value;
    var reminderPref = form.elements[6].value;
    var eventDescription = form.elements[7].value;

    var icsString = icsComplier(eventName, location, timeZone, startTimeDate, endTimeDate, reminderPref, eventDescription);
    var googleString = googleCompiler(eventName, startTimeDate, endTimeDate, timeZone, eventDescription, location);
    
    createFile(icsString, googleString, eventID)
}

function icsComplier(eventName, location, timeZone, startTimeDate, endTimeDate, reminderPref, eventDescription) {
    var icsString = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:Brandon\nMETHOD:PUBLISH\nX-PUBLISHED-TTL:PT1H\nBEGIN:VEVENT\n";
    icsString += "UID:" + uidGenerator() + "\n";
    icsString += "SUMMARY:" + eventName + "\n";
    icsString += "DTSTAMP:" + dateTimeConverter(moment().utc().format()) + "\n";
    icsString += "DTSTART:" + dateTimeConverter(moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format()) + "\n";
    icsString += "DTEND:" + dateTimeConverter(moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format()) + "\n";
    icsString += "DESCRIPTION:" + eventDescription + "\n";
    icsString += "LOCATION:" + location + "\n";
    icsString += "BEGIN:VALARM\nACTION:DISPLAY\n";
    icsString += "TRIGGER:" + (reminderPref === "hour" ? "-PT60M\n" : "-PT1440M\n");
    icsString += "END:VALARM\nEND:VEVENT\nEND:VCALENDAR"
    return icsString
}

function googleCompiler (eventName, startTimeDate, endTimeDate, timeZone, eventDescription, location) {
    var googleString = "https://www.google.com/calendar/render?action=TEMPLATE"
    googleString += "&text=" + encodeURIComponent(eventName.trim());
    googleString += "&dates=" + dateTimeConverter(moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format());
    googleString += "%2F" + dateTimeConverter(moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format());
    googleString += "&details=" + encodeURIComponent(eventDescription.trim());
    googleString += "&location=" + encodeURIComponent(location.trim())
    return googleString
}

function uidGenerator() {
    var uid = "";
    for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uid += '-';
        } else {
            uid += Math.round(Math.random() * 16).toString(16);
        }
    }
    return uid;
}

function dateTimeConverter(dateTime) {
    dateTime = dateTime.replaceAll('-', '');
    dateTime = dateTime.replaceAll(':', '');
    dateTime += dateTime.indexOf('Z') === -1 ? '00Z' : '';
    return dateTime
}

function createFile(icsString, googleString, eventID) {
    var blob = new Blob([icsString], {
       type: "text/plain;charset=utf-8",
    });
    saveAs(blob, eventID + ".ics");
    saveAs(blob, eventID + ".vcs");

    var blob = new Blob([googleString], {
        type: "text/plain;charset=utf-8",
     });
     saveAs(blob, eventID + ".txt");
 }

 function resetButton () {
    document.getElementById('myform').reset();
 }