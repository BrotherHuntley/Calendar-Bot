//function inputs information required or an ics or vcs file and outputs the formatted string 
function icsComplier(eventName, location, timeZone, startTimeDate, endTimeDate, reminderPref, eventDescription) {
    var icsString = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:Calendar-Bot\nMETHOD:PUBLISH\nX-PUBLISHED-TTL:PT1H\nBEGIN:VEVENT\n";
    icsString += "UID:" + uidGenerator() + "\n";
    icsString += "SUMMARY:" + eventName + "\n";
    icsString += "DTSTAMP:" + dateTimeConverter(moment().utc().format()) + "\n";
    icsString += "DTSTART:" + dateTimeConverter(moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format()) + "\n";
    icsString += "DTEND:" + dateTimeConverter(moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format()) + "\n";
    icsString += "DESCRIPTION:" + eventDescription.replaceAll('\n','\\n') + "\n";
    icsString += "LOCATION:" + location + "\n";
    icsString += "BEGIN:VALARM\nACTION:DISPLAY\n";
    icsString += "TRIGGER:" + (reminderPref === "hour" ? "-PT60M\n" : "-PT1440M\n");
    icsString += "END:VALARM\nEND:VEVENT\nEND:VCALENDAR"
    return icsString
}

//function inputs information required or a google calendar link and outputs the link 
function googleCompiler(eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription) {
    var googleURL = "https://www.google.com/calendar/render?action=TEMPLATE"
    googleURL += "&text=" + encodeURIComponent(eventName.trim());
    googleURL += "&dates=" + dateTimeConverter(moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format());
    googleURL += "%2F" + dateTimeConverter(moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format());
    googleURL += "&details=" + encodeURIComponent(eventDescription.trim());
    googleURL += "&location=" + encodeURIComponent(location.trim());
    return googleURL
}

function outlookCompilier(eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription) {
    var outlook365URL = "https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent"
    var allDaySelector = startTimeDate.slice(0,10) === endTimeDate.slice(0,10) ? 'false': 'true'
    outlook365URL += "&startdt=" + moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format();
    outlook365URL += "&enddt=" + moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format();
    outlook365URL += "&allday=" + allDaySelector;
    outlook365URL += "&subject=" + encodeURIComponent(eventName.trim());
    outlook365URL += "&body=" + encodeURIComponent(eventDescription.trim());
    outlook365URL += "&location=" + encodeURIComponent(location.trim());
    return outlook365URL;
}


function yahooCompiler (eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription) {
    var yahooURL = "https://calendar.yahoo.com/?v=60"
    yahooURL += "&TITLE" + encodeURIComponent(eventName.trim());
    yahooURL += "&ST=" + dateTimeConverter(moment.tz(startTimeDate.replace('T', ' '), timeZone).utc().format());
    yahooURL += "&ET=" + dateTimeConverter(moment.tz(endTimeDate.replace('T', ' '), timeZone).utc().format());
    yahooURL += "&DESC=" + encodeURIComponent(eventDescription.trim());
    yahooURL += "&in_loc=" + encodeURIComponent(location.trim()) + 'E';
    return yahooURL;
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
function createFile(icsString, googleURL, eventID) {
    var blob = new Blob([icsString], {
        type: "text/plain;charset=utf-8",
    });
    saveAs(blob, eventID + ".ics");
    saveAs(blob, eventID + ".vcs");

    var blob = new Blob([googleURL], {
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

function generateCode(icsString, googleURL, outlook365URL, yahooURL) {
    var icsURL = 'data:text/calendar;charset=utf-8,' + icsString.replaceAll('\n','%0A');
    var code = '&lt;table role=\"presentation\" style=\"text-align:center; width:100%; margin-block:20px;\"&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td style=\"margin-inline:auto\"&gt;&lt;p style=\"margin-bottom:0;\"&gt;Add event to your calendar&lt;/p&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;&lt;table style=\"margin-inline:auto;\"&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td style=\"width:30px\"&gt;'
    code += '&lt;a href=\"' + icsURL + '\"&gt;Apple&lt;/a&gt;&lt;/td&gt;&lt;td style=\"width:30px\"&gt;'
    code += '&lt;a href=\"' + googleURL + '\" target=\"_blank\"&gt;Google&lt;/a&gt;&lt;/td&gt;&lt;td style=\"width:30px\"&gt;'
    code += '&lt;a href=\"' + outlook365URL + '\" target=\"_blank\"&gt;Office 365&lt;/a&gt;&lt;/td&gt;&lt;td style=\"width:30px\"&gt;'
    code += '&lt;a href=\"' + icsURL + '\"&gt;Outlook&lt;/a&gt;&lt;/td&gt;&lt;td style=\"width:30px\"&gt;'
    code += '&lt;a href=\"' + yahooURL + '\" target=\"_blank\"&gt;Yahoo&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;'
    document.getElementById('codeDisplay').className = "showCode"
    document.getElementById("insertCode").innerHTML = code;
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
    var googleURL = googleCompiler(eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription);
    var outlook365URL = outlookCompilier(eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription);
    var yahooURL = yahooCompiler (eventName, location, timeZone, startTimeDate, endTimeDate, eventDescription);

    var completeFormBool = completeFormCheck(form);
    var dateOkBool = dateOrderCheck(startTimeDate, endTimeDate, timeZone);
    completeFormBool && dateOkBool ? createFile(icsString, googleString, eventID):errorMessage();

})

//if reset is selected, clears all fields and removes error warnings
form.addEventListener("reset", function (event) {
    for (i = 0; i < form.length; i++) {
        var resetElement = document.getElementById(form.elements[i].id + 'Error');
        if (resetElement !== null && resetElement.className === "error") {
            resetElement.className = "noError";
        }
    }
    document.getElementById('switchError').className = "noError"
    document.getElementById('pastStartError').className = "noError"
    document.getElementById('pastEndError').className = "noError"
    document.getElementById('codeDisplay').className = "hideCode"
})