var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');
var moment = require('moment');

var OrderStore = Fluxxor.createStore({

	initialize: function() {
		this.order = {};
		this.isLoadingOrder = false;
		this.checkoutExpireTime = null;
		this.reservationError = null;
		this.isLoadingReservation = false;
		this.reserveSessionId = null;
		this.isLoadingBooking = false;

		this.bindActions(
			LanwarConstants.CHECKOUT_SUCCESS, this.onCheckoutSuccess,
			LanwarConstants.GET_ORDER_LOADING, this.onGetOrderLoading,
			LanwarConstants.GET_ORDER_SUCCESS, this.onGetOrderSuccess,
			LanwarConstants.GET_ORDER_ERROR, this.onGetOrderError,
			LanwarConstants.LOAD_MAKE_RESERVATION, this.onLoadMakeReservation,
			LanwarConstants.LOAD_MAKE_RESERVATION_SUCCESS, this.onLoadMakeReservationSuccess,
			LanwarConstants.LOAD_MAKE_RESERVATION_FAILURE, this.onLoadMakeReservationFailure,
			LanwarConstants.ALL_SEATS_UNRESERVED, this.onAllSeatsUnreserved,
			LanwarConstants.BOOK_SEATS_LOADING, this.onBookSeatsLoading,
			LanwarConstants.BOOK_SEATS_SUCCESS, this.onBookSeatsSuccess,
			LanwarConstants.BOOK_SEATS_ERROR, this.onBookSeatsError,
			LanwarConstants.SET_LABEL_LOADING, this.onSetLabelLoading,
			LanwarConstants.SET_LABEL_SUCCESS, this.onSetLabelSuccess,
			LanwarConstants.SET_LABEL_ERROR, this.onSetLabelError
		);
	},

	onCheckoutSuccess: function(payload) {

		this.order = payload;
		this.emit("change");

	},

	onGetOrderLoading: function(payload) {
		this.order = {};
		this.isLoadingOrder = true;
		this.emit("change");
	},

	onGetOrderSuccess: function(payload) {
		this.order = payload;
		this.isLoadingOrder = false;
		this.emit("change");
	},

	onGetOrderError: function(payload) {
		this.isLoadingOrder = false;
		this.emit("change");
		alert(payload.error);
	},

	onLoadMakeReservation: function(payload) {
		this.isLoadingReservation = true;
		this.reservationError = null;
		this.emit("change");
	},

	onLoadMakeReservationSuccess: function(payload) {

		// is this the first reservation?
		if (this.checkoutExpireTime == null)
			this.checkoutExpireTime = moment().add(5, 'minutes');

		this.isLoadingReservation = false;
		this.reserveSessionId = payload.sessionId;
		this.order.tickets[payload.ticketKey]["seat"] = {
			roomKey: payload.roomKey,
			rowKey: payload.rowKey,
			seatKey: payload.seatKey
		};
		this.emit("change");

	},

	onLoadMakeReservationFailure: function(payload) {
		this.isLoadingReservation = false;
		alert(payload.error);
		this.emit("change");
	},

	onAllSeatsUnreserved: function(payload) {
		this.checkoutExpireTime = null;
		this.emit("change");
	},

	onBookSeatsLoading: function(payload) {
		this.isLoadingBooking = true;
		this.emit("change");
	},

	onBookSeatsSuccess: function(payload) {
		this.isLoadingBooking = false;
		this.checkoutExpireTime = null;
		this.order.tickets = payload;
		this.emit("change");
	},

	onBookSeatsError: function(payload) {
		this.isLoadingBooking = false;
		this.emit("change");
		alert(payload.error);
	},

	onSetLabelLoading: function(payload) {

		for (var i = 0; i < this.order.tickets.length; i++) {
			if (this.order.tickets[i].id == payload.ticketId)
				this.order.tickets[i].isLabelLoading = true;
		}

		this.emit("change");

	},

	onSetLabelSuccess: function(payload) {

		for (var i = 0; i < this.order.tickets.length; i++) {
			if (this.order.tickets[i].id == payload.id) {
				this.order.tickets[i].isLabelLoading = false;
				this.order.tickets[i].label = payload.label;
			}
		}

		this.emit("change");

	},

	onSetLabelError: function(payload) {

		for (var i = 0; i < this.order.tickets.length; i++) {
			if (this.order.tickets[i].id == payload.ticketId)
				this.order.tickets[i].isLabelLoading = false;
		}

		this.emit("change");
		alert(payload.error);

	},

	getState: function() {

		return {
			order: this.order,
			isLoadingOrder: this.isLoadingOrder,
			checkoutExpireTime: this.checkoutExpireTime,
			reservationError: this.reservationError,
			isLoadingReservation: this.isLoadingReservation,
			reserveSessionId: this.reserveSessionId,
			isLoadingBooking: this.isLoadingBooking
		};

	},

});

module.exports = OrderStore;