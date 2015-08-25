var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');
var _ = require('underscore');

var TicketTypesStore = Fluxxor.createStore({
	initialize: function() {
		this.isLoading = false;
		this.getTicketTypesError = null;
		this.ticketTypes = {};

		this.bindActions(
			LanwarConstants.LOAD_TICKET_TYPES, this.onLoadTicketTypes,
			LanwarConstants.LOAD_TICKET_TYPES_SUCCESS, this.onLoadTicketTypesSuccess,
			LanwarConstants.LOAD_TICKET_TYPES_FAILURE, this.onLoadTicketTypesFailure
		);
	},

	onLoadTicketTypes: function(payload) {
		this.isLoading = true;
		this.getTicketTypesError = false;
		this.emit("change");
	},

	onLoadTicketTypesSuccess: function(payload) {
		this.isLoading = false;
		this.ticketTypes = payload.ticketTypes.reduce(function(acc, ticketType){
			var clientId = _.uniqueId();
			acc[clientId] = {id: ticketType.id, name: ticketType.name, price: ticketType.price, description: ticketType.description, options: ticketType.options, isOptionRequired: ticketType.isOptionRequired == true};
			return acc;
		}, {});
		this.emit("change");
	},

	onLoadTicketTypesFailure: function(payload) {
		this.isLoading = false;
		this.getTicketTypesError = payload.error;
		this.emit("change");
	},

	getState: function() {
		return {
			ticketTypes: this.ticketTypes,
			isLoading: this.isLoading,
			getTicketTypesError: this.getTicketTypesError
		}
	}
});

module.exports = TicketTypesStore;