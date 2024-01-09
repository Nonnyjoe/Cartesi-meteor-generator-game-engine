# JavaScript DApp Template

This is a template for JavaScript Cartesi DApps. It uses node to execute the backend application.
The application entrypoint is the `src/index.js` file. It is bundled with [esbuild](https://esbuild.github.io), but any bundler can be used.


## ABOUT APP
Meteor generator is a game algorithm built on cartessy to help run complex random number generation for a game app.

This contract basically collects a number type argument which represents the difficulty of a game level, the number passed in represent the number of meteors that a player will have to navigate through, each metero is a json object containing:

- Meteor size.
- Meteor speed.
- Meteor impact Latitude.
- Meteor impact Longitude.

Each meteor has different random numbers generated to represent each of its properties.

## Running the App
- Clone the project.
- cd into the project folder
- run ```sunodo build``` in one terminal to build the project.
- Create another terminal then run ```sunodo run``` to start the backend.
- finally in the first terminal, run ```sunodo send generic``` then follow the promps accordingly until you're asked to type an input.
- Pass in any number of your choice, preferably below 20.
- check out the second terminal running the backend for a transaction report and the output meteor data.