var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var AdminOverviewStore = Fluxxor.createStore({

	initialize: function() {
		this.isLoadingTicketStats = false;
		this.ticketStatsData = [];
		this.isLoadingTicketSalesOverTime = false;

		this.bindActions(
			LanwarConstants.TICKET_STATS_LOADING, this.onTicketStatsLoading,
			LanwarConstants.TICKET_STATS_SUCCESS, this.onTicketStatsSuccess,
			LanwarConstants.TICKET_STATS_ERROR, this.onTicketStatsError,
			LanwarConstants.TICKET_SALES_OVER_TIME_LOADING, this.onTicketSalesOverTimeLoading,
			LanwarConstants.TICKET_SALES_OVER_TIME_SUCCESS, this.onTicketSalesOverTimeSuccess,
			LanwarConstants.TICKET_SALES_OVER_TIME_ERROR, this.onTicketSalesOverTimeError
		);

	},

	onTicketStatsLoading: function(payload) {

		this.isLoadingTicketStats = true;
		this.ticketStatsData = [];
		this.emit("change");

	},

	onTicketStatsSuccess: function(payload) {

		this.isLoadingTicketStats = false;
		this.ticketStatsData = payload;
		this.emit("change");

	},

	onTicketStatsError: function(payload) {

		this.isLoadingTicketStats = false;
		this.emit("change");

		if (payload.error != 'Permission denied')
			alert(payload.error);

	},

	onTicketSalesOverTimeLoading: function(payload) {

		this.isLoadingTicketSalesOverTime = true;
		this.ticketStatsData.time = [];
		this.emit("change");

	},

	onTicketSalesOverTimeSuccess: function(payload) {

		this.isLoadingTicketSalesOverTime = false;
		this.ticketStatsData.time = payload;
		this.emit("change");
	},

	onTicketSalesOverTimeError: function(payload) {

		this.isLoadingTicketSalesOverTime = false;
		this.emit("change");

		if (payload.error != 'Permission denied')
			alert(payload.error);

	},

	getState: function() {
		return {
			isLoadingTicketStats: this.isLoadingTicketStats,
			ticketStatsData: this.ticketStatsData,
			isLoadingTicketSalesOverTime: this.isLoadingTicketSalesOverTime
		};
	}

});

module.exports = AdminOverviewStore;