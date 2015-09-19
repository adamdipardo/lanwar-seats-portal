var LanwarConstants = require('../constants/LanwarConstants');

var AdminTicketsActions = {
	getTickets: function(pageNum) {
		this.dispatch(LanwarConstants.ADMIN_TICKETS_LOADING, {});

		$.ajax({
			url: '/api/tickets/checked-in/read',
			type: 'post',
			data: {page: pageNum || 1},
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_TICKETS_SUCCESS, result);
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
					this.dispatch(LanwarConstants.ADMIN_TICKETS_ERROR, {error: errorStr});

			}.bind(this)
		});
	},
};

module.exports = AdminTicketsActions;