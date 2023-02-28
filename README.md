# Calendar-Bot

This main goal of this project was to create a simple website to create .ics and .vcs files and a google calendar link for an event.

## Project Description

This website is designed to take user input, process it, then download the necessary files.

The HTML was built with a standard form utilizing [Bootstrap](https://getbootstrap.com/), nothing revolutionary here.

The CSS was bare bones as well to keep the project simple and effective.

The JS is where the all "magic" happens. The script listens for the submit button and reset buttons. 

When submit is clicked the script takes the form data, formats it, and check for 2 types of error scenarios. The first error scenarion is an empty form element. The second error is regarding a problem with the enetered dates. The script will change the class on the error elements to show what the error is. If both error function return tru the program creates the .ics .vcs files and a .txt file with the google calendar link.

The reset button return all fields to their default state, and clears any errors.

## Credits

This project could not have been done without: 
[ical_generator](https://icalgenerator.net/) for inspiration.
[moment](https://momentjs.com/) for handling timezones (phew).
[tutorialspoint](https://www.tutorialspoint.com/how-to-create-and-save-text-file-in-javascript/) for a great article on printing to a txt file.
[alluregraphicdesign](https://pixabay.com/users/alluregraphicdesign-945398/) for the logo.
[Memed_Nurrohmad](https://pixabay.com/users/memed_nurrohmad-3307648/) also for the logo.

## License

[MIT](https://choosealicense.com/licenses/mit/)
