var LanwarConstants = require('../constants/LanwarConstants');

var CheckInActions = {
	checkInTicketByHash: function(hash) {
		this.dispatch(LanwarConstants.CHECK_IN_HASH_LOADING, {});

		$.ajax({
			url: '/api/tickets/check-in/hash/'+hash,
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.CHECK_IN_HASH_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "There was an error reading the QR-code, please try scanning again.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {error: "Your session has timed-out. The ticket was not checked in. Please login again."});
				
				this.dispatch(LanwarConstants.CHECK_IN_HASH_ERROR, {error: errorStr == "Permission denied" ? "" : errorStr});
			}.bind(this)
		});
	},
	checkInTicketById: function(id) {
		this.dispatch(LanwarConstants.CHECK_IN_ID_LOADING, {});

		$.ajax({
			url: '/api/tickets/check-in/id/'+id,
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.CHECK_IN_ID_SUCCESS, result);
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
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {error: "Your session has timed-out. The ticket was not checked in. Please login again."});
				
				this.dispatch(LanwarConstants.CHECK_IN_ID_ERROR, {error: errorStr == "Permission denied" ? "" : errorStr});
			}.bind(this)
		});
	},
	setTicketId: function(id) {
		this.dispatch(LanwarConstants.CHECK_IN_SET_TICKET_ID, {ticketId: id});
	},
	dismissCheckIn: function() {
		this.dispatch(LanwarConstants.CHECK_IN_DISMISS, {});
	}
};

module.exports = CheckInActions;