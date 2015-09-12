# LanWar Tickets Portal

This project aims to provide an interface for ordering tickets, and reserving seats for LANWAR X. Also provided is admin functionality for reviewing orders, and checking-in tickets either manually or by scanning the ticket's QR code. Built with [React](http://facebook.github.io/react/) and [Fluxxor](http://fluxxor.com).

The portal is only front-end, all back-end work is handled by a separate API and communication between the two is via Ajax.

## Features

* Ordering one or more tickets, with payment handled by [Stripe Checkout](https://stripe.com/docs/checkout).
* Tickets can have options
* Reserving seats
* Reviewing order
* Setting labels for tickets
* Printing a copy of the tickets PDF
* Responsive

### Admin Features

* Create manual or cash orders, where no credit card info is needed.
  * Can also include a student discount ($5 off each ticket, and tickets are marked as being "STUDENT")
* View all orders
* Check-in tickets either by manually lookup the order/ticket, or by QR code scan
* View a list of all checked-in tickets
* Lookup order by entering in the Order ID #

## Installation

1. Install [Node.js](nodejs.org), and [Gulp](http://gulpjs.com/) globally if you don't have them already.
2. Open a terminal in the project directory, and run `npm install` to install all dependencies.

## Running

1. In the project directory, run `gulp` to start a dev version of the project.
2. The project will run and watch for changes to the source code.
3. Access the project by going to `http://127.0.0.1:8000` in your web browser.

### Notes

* Any changes made to the source code will auto-refresh the project in the browser.
* Admin login credentials for testing are `adamdipardo@fastmail.fm` and `password`.
* Stripe testing credentials are `4242 4242 4242 4242` for a credit card. Expiry and CVC can be madeup.

## Building

1. Run `gulp build-only --env=production` to create a production build of the project. This minifies all JS. Output goes to the `build` directory.
2. Run `gulp create-dist` to create a final distrobution-ready version of the project. The difference between this step and the last is that this step hashes all static resources, so that they can be cached. Output goes to the `dist` directory.

## Changelog

## To-Do

* Add more stuff to footer, maybe
* Export list of orders/tickets to CSV
* Add UA3XXX rooms?