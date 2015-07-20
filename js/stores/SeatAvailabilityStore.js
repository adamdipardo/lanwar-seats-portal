var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var SeatAvailabilityStore = Fluxxor.createStore({
	initialize: function() {
		this.seats = {};
		this.isLoadingStatuses = false;
		this.seatStatusesError = null;

		this.bindActions(
			LanwarConstants.LOAD_SEAT_STATUSES, this.onLoadSeatStatuses,
			LanwarConstants.LOAD_SEAT_STATUSES_SUCCESS, this.onLoadSeatStatusesSuccess,
			LanwarConstants.LOAD_SEAT_STATUSES_FAILURE, this.onLoadSeatStatusesFailure,
			LanwarConstants.SEAT_STATUS_CHANGED, this.onSeatStatusChanged
		);
	},

	onLoadSeatStatuses: function() {

		this.isLoadingStatuses = true;
		this.seatStatusesError = null;
		this.seats = {};
		this.emit("change");

	},

	onLoadSeatStatusesSuccess: function(payload) {

		this.isLoadingStatuses = false;

		payload.reserved.forEach(function(element,index) {
			this.seats[element] = element;
		}.bind(this));

		payload.booked.forEach(function(element,index) {
			this.seats[element] = element;
		}.bind(this));

		this.emit("change");

	},

	onLoadSeatStatusesFailure: function(payload) {

		this.isLoadingStatuses = false;
		this.seatStatusesError = payload.error;
		this.emit("change");

	},

	onSeatStatusChanged: function(payload) {

		if (payload.status == "reserved" || payload.status == "booked")
		{
			this.seats[payload.seatKey] = payload.seatKey;
		}
		else if (payload.seatKey in this.seats)
			delete(this.seats[payload.seatKey]);

		this.emit("change");

	},

	getState: function() {
		return {
			seats: this.seats,
			isLoadingStatuses: this.isLoadingStatuses,
			seatStatusesError: this.seatStatusesError
		};
	}
});

module.exports = SeatAvailabilityStore;