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
				this.dispatch(LanwarConstants.CHECK_IN_HASH_ERROR, {error: JSON.parse(xhr.responseText).error, order: JSON.parse(xhr.responseText).order});
			}.bind(this)
		});
	},
	dismissCheckIn: function() {
		this.dispatch(LanwarConstants.CHECK_IN_DISMISS, {});
	}
};

module.exports = CheckInActions;