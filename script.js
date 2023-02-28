//function inputs information required or an ics or vcs file and outputs the formatted string 
function icsComplier(eventName, location, timeZone, startTimeDate, endTimeDate, reminderPref, eventDescription) {
    var icsString = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:Calendar-Bot\nMETHOD:PUBLISH\nX-PUBLISHED-TTL:PT1H\nBEGIN:VEVENT\n";
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

//function inputs information required or a google calendar link and outputs the link 
function googleCompiler(eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription) {
    var googleString = "https://www.google.com/calendar/render?action=TEMPLATE"
    googleString += "&text=" + encodeURIComponent(eventName.trim());
    googleString += "&dates=" + dateTimeConverter(moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format());
    googleString += "%2F" + dateTimeConverter(moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format());
    googleString += "&details=" + encodeURIComponent(eventDescription.trim());
    googleString += "&location=" + encodeURIComponent(location.trim())
    return googleString
}

//function returns a random hex UID formatted xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8)-(4)-(4)-(4)-(12)  
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

//function formats the date and time received from the form into a format readable by moment
function dateTimeConverter(dateTime) {
    dateTime = dateTime.replaceAll('-', '');
    dateTime = dateTime.replaceAll(':', '');
    dateTime += dateTime.indexOf('Z') === -1 ? '00Z' : '';
    return dateTime
}

//function prints the ics and vcs file for download and a txt file for the google link 
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

//function checking if all of the form is complete, outputing a boolean
function completeFormCheck(form) {
    var goodNotGood = true;
    for (i = 0; i < form.length; i++) {
        var errorElement = document.getElementById(form.elements[i].id + 'Error');
        if (form.elements[i].value === "") {
            goodNotGood = false;
            errorElement.className = "error";
        } else if (errorElement !== null) {
            errorElement.className = "noError";
        }
    }
    return goodNotGood;
}

//function checking the start and end dates are in the future and the end date is after start date, outputs boolean
function dateOrderCheck(startTimeDate, endTimeDate, timeZone) {
    var goodNotGood = true;
    var startDateMoment = moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format();
    var endDateMoment = moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format();
    if (moment(endDateMoment).isBefore(startDateMoment)) {
        document.getElementById('switchError').className = "error"
        goodNotGood = false;
    } else {
        document.getElementById('switchError').className = "noError"
    }
    
    if (!moment().isBefore(startDateMoment) && startDateMoment !== "Invalid date") {
        document.getElementById('pastStartError').className = "error"
        goodNotGood = false;
    } else if (!moment().isBefore(endDateMoment) && endDateMoment !== "Invalid date") {
        document.getElementById('pastEndError').className = "error"
        goodNotGood = false;
    }
    return goodNotGood;
}

//function to display an error if any error populates (not used currently)
function errorMessage() {
}

var form = document.getElementById("myForm");

//if submit is selected, receives form data, compiles, checks for errors then prints
form.addEventListener("submit", function (event) {
    event.preventDefault();

    var eventID = form.elements[0].value;
    var eventName = form.elements[1].value;
    var location = form.elements[2].value;
    var timeZone = form.elements[3].value;
    var startTimeDate = form.elements[4].value;
    var endTimeDate = form.elements[5].value;
    var reminderPref = form.elements[6].value;
    var eventDescription = form.elements[7].value;

    var icsString = icsComplier(eventName, location, timeZone, startTimeDate, endTimeDate, reminderPref, eventDescription);
    var googleString = googleCompiler(eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription);

    var completeFormBool = completeFormCheck(form);
    var dateOkBool = dateOrderCheck(startTimeDate, endTimeDate, timeZone);
    console.log(completeFormBool);
    console.log(dateOkBool);
    completeFormBool && dateOkBool ? createFile(icsString, googleString, eventID):errorMessage();

})

//if reset is selected, clears all fields and removes error warnings
form.addEventListener("reset", function (event) {
    for (i = 0; i < form.length; i++) {
        var resetElement = document.getElementById(form.elements[i].id + 'Error');
        if (resetElement !== null && resetElement.className === "error"){
            resetElement.className = "noError";
        }
    }
    document.getElementById('switchError').className = "noError"
    document.getElementById('pastStartError').className = "noError"
    document.getElementById('pastEndError').className = "noError"
})