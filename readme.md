# LanWar Tickets Portal

This project aims to provide an interface for ordering tickets, and reserving seats for LANWAR X. Also provided is admin functionality for reviewing orders, and checking-in tickets either manually or by scanning the ticket's QR code.

The portal is only front-end, all back-end work is handled by a separate API and communication between the two is via Ajax.

## Features

* Ordering one or more tickets, with payment handled by (Stripe Checkout)[https://stripe.com/docs/checkout].
* Reserving seats
* Reviewing order
* Setting labels for tickets
* Printing a copy of the tickets PDF

### Admin Features

* Create manual or cash orders, where no credit card info is needed.
* View all orders
* Check-in tickets either by manually lookup the order/ticket, or by QR code scan
* View a list of all checked-in tickets

## Technologies

This project is created using [React](http://facebook.github.io/react/) and [Fluxxor](fluxxor.com). Local development is aided by [Gulp](http://gulpjs.com/).

## Installation

1. Install [Node.js](nodejs.org), and [Gulp](http://gulpjs.com/) globally if you don't have them already.
2. Open a terminal in the project directory, and run `npm install` to install all dependencies.
3. Run `gulp` to start a dev version of the project.

## Building

1. Run `gulp build-only --env=production` to create a production build of the project. This minifies all JS. Output goes to the `build` directory.
2. Run `gulp create-dist` to create a final distrobution-ready version of the project. The difference between this step and the last is that this step hashes all static resources, so that they can be cached. Output goes to the `dist` directory.