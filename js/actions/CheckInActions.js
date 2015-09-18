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
				try	{
					this.dispatch(LanwarConstants.CHECK_IN_HASH_ERROR, {error: JSON.parse(xhr.responseText).error, order: JSON.parse(xhr.responseText).order});
				}
				catch (e) {
					this.dispatch(LanwarConstants.CHECK_IN_HASH_ERROR, {error: 'There was an error reading the QR-code, please try scanning again.'});
				}
			}.bind(this)
		});
	},
	dismissCheckIn: function() {
		this.dispatch(LanwarConstants.CHECK_IN_DISMISS, {});
	}
};

module.exports = CheckInActions;