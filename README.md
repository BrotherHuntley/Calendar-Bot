# Calendar-Bot

This main goal of this project was to create a simple website to create .ics and .vcs files and a google calendar link for an event.

## Project Description

This website is designed to take user inputed event details including: ID, Name, Date, Time, Reminder Period, and Description. The program then processes the data to download an .ics and .vcs file as well as a .txt file with a google calendar link. I plan to add software to output a txt file with usable html elements to embed in an email. Here is a brief description of how it was built:

The HTML was built with a standard form utilizing [Bootstrap](https://getbootstrap.com/), nothing revolutionary here.

The CSS was bare bones as well to keep the project simple and effective.

The JS is where the all "magic" happens. The script listens for the submit button and reset buttons. 

When submit is clicked the script takes the form data, formats it, and check for 2 types of error scenarios. The first error scenarion is an empty form element. The second error is regarding a problem with the enetered dates. The script will change the class on the error elements to show what the error is. If both error function return tru the program creates the .ics .vcs files and a .txt file with the google calendar link.

The reset button returns all fields to their default state, and clears any errors.

## Credits

This project could not have been done without: 
[ical_generator] (https://icalgenerator.net/) for inspiration.
[moment] (https://momentjs.com/) for handling timezones (phew).
[tutorialspoint] (https://www.tutorialspoint.com/how-to-create-and-save-text-file-in-javascript/) for a great article on printing to a txt file.
[alluregraphicdesign] (https://pixabay.com/users/alluregraphicdesign-945398/) for the logo.
[Memed_Nurrohmad] (https://pixabay.com/users/memed_nurrohmad-3307648/) also for the logo.
[Steve_Fenton](https://www.stevefenton.co.uk/blog/2010/11/adding-multiple-lines-to-description-in-icalendar-files/) for info on how to make new lines in ics files.

## License

[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) [2023] [Brandon Huntley]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
