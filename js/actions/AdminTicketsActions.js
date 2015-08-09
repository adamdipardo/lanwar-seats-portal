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
				this.dispatch(LanwarConstants.ADMIN_TICKETS_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
};

module.exports = AdminTicketsActions;