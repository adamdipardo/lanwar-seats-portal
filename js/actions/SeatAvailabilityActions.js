var LanwarConstants = require('../constants/LanwarConstants');

var SeatAvailabilityActions = {
	loadSeatStatuses: function() {
		this.dispatch(LanwarConstants.LOAD_SEAT_STATUSES);

		$.ajax({
			url: LanwarConstants.RESERVATION_API + "/read",
			type: "get",
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_SEAT_STATUSES_SUCCESS, {reserved: result.reserved, booked: result.booked});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_SEAT_STATUSES_FAILURE, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},

	seatStatusChanged: function(seatId, status) {
		this.dispatch(LanwarConstants.SEAT_STATUS_CHANGED, {seatKey: seatId, status: status});
	},
};

module.exports = SeatAvailabilityActions;