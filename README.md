# Ross' FCC Voting App

## Overview

This is my implementation of the voting app, created as a part of the "Build a Voting App" challenge within the Free Code Camp course Map. This application was built off of the Clementine.js FCC Boilerplate and using this web app you can vote on, create, edit and update polls.

Below are details on the implementation of this application.

## Back End

### Service Layer

The service layer of this application has been built using node.js and Express.js to create an API that is called from the front end.

Mongoose, a wrapper for MongoDB, is used for interactions with the data layer.

For sign in, the Passport.js Library has been integrated with the GitHub OATH service

For vote tracking, sign in and cookies are used to determine if a user has voted before. (Note this is not an ideal solution as a user could simply clear cookies and vote again)

For error handling, custom error handling middleware has been used to catch and log errors.

### Data Layer

The data layer of this application uses mongoDB as its NoSQL database

## Front End

The front end has been built as a SPA using the Bootstrap (version 4) library with jQuery and angular.js (version 1). The Gulp task runner is used to minify and bundle files for the front end.

## Licenses

### Clementine.js FCC Boilerplate License

MIT License. [Click here for more information.](LICENSE.md)
