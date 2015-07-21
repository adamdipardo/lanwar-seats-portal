var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');
var _ = require('underscore');
var moment = require('moment');

var BuyTicketsStore = Fluxxor.createStore({
	initialize: function() {
		this.tickets = {};
		this.totalPrice = 0.0;
		this.formData = {};
		this.isLoadingReservation = false;
		this.reservationError = null;
		this.checkoutExpireTime = null;
		this.reserveSessionId = null;
		this.checkoutSuccess = false;
		this.checkoutError = null;
		this.isLoadingCheckout = false;

		this.bindActions(
			LanwarConstants.CHANGE_TICKET_QUANTITY, this.onChangeTicketQuantity,
			LanwarConstants.SAVE_TICKET_FORM_DATA, this.onSaveTicketFormData,
			LanwarConstants.LOAD_MAKE_RESERVATION, this.onLoadMakeReservation,
			LanwarConstants.LOAD_MAKE_RESERVATION_SUCCESS, this.onLoadMakeReservationSuccess,
			LanwarConstants.LOAD_MAKE_RESERVATION_FAILURE, this.onLoadMakeReservationFailure,
			LanwarConstants.ALL_SEATS_UNRESERVED, this.onAllSeatsUnreserved,
			LanwarConstants.CHECKOUT_SUCCESS, this.onCheckoutSuccess,
			LanwarConstants.CHECKOUT_ERROR, this.onCheckoutError,
			LanwarConstants.CHECKOUT_LOADING, this.onCheckoutLoading
		);
	},

	onChangeTicketQuantity: function(payload) {
		// remove existing tickets from store
		for (var i in this.tickets)
			if (this.tickets[i].id == payload.ticketType.id) delete(this.tickets[i]);

		// add
		for (var i = 0; i < payload.quantity; i++)
		{
			var id = _.uniqueId();
			this.tickets[id] = JSON.parse(JSON.stringify(payload.ticketType));
			this.tickets[id].seat = {};
		}

		// update total price
		this.totalPrice = this._getTotalPrice();

		this.emit("change");
	},

	onSaveTicketFormData: function(payload) {
		this.formData = payload.formData;
		this.checkoutExpireTime = null;
		this.emit("change");
	},

	onLoadMakeReservation: function(payload) {
		this.isLoadingReservation = true;
		this.reservationError = null;
		this.emit("change");
	},

	onLoadMakeReservationSuccess: function(payload) {

		// is this the first reservation?
		if (this.checkoutExpireTime == null)
			this.checkoutExpireTime = moment().add(10, 'minutes');

		this.isLoadingReservation = false;
		this.reserveSessionId = payload.sessionId;
		this.tickets[payload.ticketKey]["seat"] = {
			roomKey: payload.roomKey,
			rowKey: payload.rowKey,
			seatKey: payload.seatKey
		};
		this.emit("change");

	},

	onLoadMakeReservationFailure: function(payload) {
		this.isLoadingReservation = false;
		this.reservationError = payload.error;
		this.emit("change");
	},

	onAllSeatsUnreserved: function(payload) {
		this.checkoutExpireTime = null;
		this.emit("change");
	},

	onCheckoutSuccess: function(payload) {
		this.isLoadingCheckout = false;
		this.checkoutSuccess = true;
		this.checkoutExpireTime = null;
		this.emit("change");
	},

	onCheckoutError: function(payload) {
		this.isLoadingCheckout = false;
		this.checkoutError = payload.error;
		alert(payload.error);
		this.emit("change");
	},

	onInitCheckout: function() {
		this.isLoadingCheckout = false;
		this.checkoutError = null;
		this.checkoutSuccess = false;
		this.emit("change");
	},

	onCheckoutLoading: function() {
		this.isLoadingCheckout = true;
		this.emit("change");
	},

	getState: function() {
		return {
			tickets: this.tickets,
			totalPrice: this.totalPrice,
			formData: this.formData,
			isLoadingReservation: this.isLoadingReservation,
			reservationError: this.reservationError,
			checkoutExpireTime: this.checkoutExpireTime,
			reserveSessionId: this.reserveSessionId,
			checkoutSuccess: this.checkoutSuccess,
			checkoutError: this.checkoutError,
			isLoadingCheckout: this.isLoadingCheckout
		}
	},

	_getTotalPrice: function() {
		var price = 0.0;
		for (var i in this.tickets)
			price += this.tickets[i].price;
		return price;
	}
});	

module.exports = BuyTicketsStore;