var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var AdminTicketsStore = Fluxxor.createStore({

	initialize: function() {
		this.tickets = [];
		this.ticketsPaging = {};
		this.isLoadingTickets = false;

		this.bindActions(
			LanwarConstants.ADMIN_TICKETS_LOADING, this.onAdminTicketsLoading,
			LanwarConstants.ADMIN_TICKETS_SUCCESS, this.onAdminTicketsSuccess,
			LanwarConstants.ADMIN_TICKETS_ERROR, this.onAdminTicketsError
		);
	},

	onAdminTicketsLoading: function(payload) {

		this.tickets = [];
		this.isLoadingTickets = true;
		this.emit("change");

	},

	onAdminTicketsSuccess: function(payload) {

		this.tickets = payload.tickets;
		this.ticketsPaging = {
			from: payload.from,
			to: payload.to,
			currentPage: payload.currentPage,
			lastPage: payload.lastPage,
			count: payload.count
		};
		this.isLoadingTickets = false;
		this.emit("change");

	},

	onAdminTicketsError: function(payload) {

		this.isLoadingTickets = false;
		this.emit("change");
		alert(payload.error);

	},

	getState: function() {

		return {
			tickets: this.tickets,
			isLoadingTickets: this.isLoadingTickets,
			ticketsPaging: this.ticketsPaging
		};

	}

});

module.exports = AdminTicketsStore;