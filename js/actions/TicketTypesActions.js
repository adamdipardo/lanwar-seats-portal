var LanwarConstants = require('../constants/LanwarConstants');

var TicketTypesActions = {
	loadTicketTypes: function() {

		this.dispatch(LanwarConstants.LOAD_TICKET_TYPES);

		$.ajax({
			url: '/api/events/' + LanwarConstants.EVENT_ID + '/tickets/read',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_TICKET_TYPES_SUCCESS, {ticketTypes: result});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_TICKET_TYPES_FAILURE, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});

	}
};

module.exports = TicketTypesActions;