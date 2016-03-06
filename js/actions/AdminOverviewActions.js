var LanwarConstants = require('../constants/LanwarConstants');
var history = require('../history');

var AdminOverviewActions = {

	getTicketStats: function() {

		this.dispatch(LanwarConstants.TICKET_STATS_LOADING, {});

		$.ajax({
			url: '/api/tickets/stats/event/' + LanwarConstants.EVENT_ID + '/read',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.TICKET_STATS_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "Sorry, there was an error. Please try again later.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.TICKET_STATS_ERROR, {error: errorStr});
			}.bind(this)
		});

	},

	getTicketSalesOverTime: function(grouping) {

		this.dispatch(LanwarConstants.TICKET_SALES_OVER_TIME_LOADING, {});

		$.ajax({
			url: '/api/tickets/sales/time/event/' + LanwarConstants.EVENT_ID + '/read',
			type: 'post',
			data: {grouping: grouping},
			success: function(result) {
				this.dispatch(LanwarConstants.TICKET_SALES_OVER_TIME_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "Sorry, there was an error. Please try again later.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.TICKET_SALES_OVER_TIME_ERROR, {error: errorStr});
			}.bind(this)
		});

	}

};

module.exports = AdminOverviewActions;