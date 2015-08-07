var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var CheckInStore = Fluxxor.createStore({

	initialize: function() {

		this.isLoadingCheckIn = false;
		this.checkInError = null;
		this.checkInTicket = {};
		this.checkInOrder = {};

		this.bindActions(
			LanwarConstants.CHECK_IN_HASH_LOADING, this.onCheckInHashLoading,
			LanwarConstants.CHECK_IN_HASH_SUCCESS, this.onCheckInHashSuccess,
			LanwarConstants.CHECK_IN_HASH_ERROR, this.onCheckInHashError,
			LanwarConstants.CHECK_IN_DISMISS, this.onDismissCheckIn
		);

	},

	onCheckInHashLoading: function(payload) {

		this.isLoadingCheckIn = true;
		this.checkInError = null;
		this.checkInOrder = {};
		this.checkInTicket = {};
		this.emit("change");

	},

	onCheckInHashSuccess: function(payload) {

		this.isLoadingCheckIn = false;
		this.checkInTicket = payload;
		this.emit("change");

	},

	onCheckInHashError: function(payload) {

		this.isLoadingCheckIn = false;
		this.checkInError = payload.error;
		this.checkInOrder = payload.order;
		this.emit("change");

	},

	onDismissCheckIn: function(payload) {

		this.isLoadingCheckIn = false;
		this.checkInError = null;
		this.checkInOrder = {};
		this.checkInTicket = {};
		this.emit("change");

	},

	getState: function() {

		return {
			isLoadingCheckIn: this.isLoadingCheckIn,
			checkInError: this.checkInError,
			checkInTicket: this.checkInTicket,
			checkInOrder: this.checkInOrder
		};

	}

});

module.exports = CheckInStore;