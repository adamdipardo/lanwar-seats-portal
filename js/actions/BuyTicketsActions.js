var LanwarConstants = require('../constants/LanwarConstants');
var history = require('../history');

var BuyTicketsActions = {
	changeTicketQuantity: function(ticketType, quantity) {
		this.dispatch(LanwarConstants.CHANGE_TICKET_QUANTITY, {ticketType: ticketType, quantity: quantity});
	},
	saveFormData: function(formData) {
		this.dispatch(LanwarConstants.SAVE_TICKET_FORM_DATA, {formData: formData});
	},
	checkout: function(userId, formData, tickets, total, token, isAdminGuestCheckout, isStudentCheckout, coupon) {

		var formattedTickets = [];
		$.each(tickets, function(index, ticket) {
			var formattedTicket = {id: ticket.id, seat: ticket.seat.seatKey};

			if (ticket.options.length > 0) {
				formattedTicket.options = [];
				for (var i = 0; i < ticket.chosenOptions.length; i++)
					formattedTicket.options.push({id: ticket.chosenOptions[i].id, notes: ticket.chosenOptions[i].notes, notes2: ticket.chosenOptions[i].notes2});
			}

			formattedTickets.push(formattedTicket);
		});

		this.dispatch(LanwarConstants.CHECKOUT_LOADING, {});

		var sendData = {
			eventId: LanwarConstants.EVENT_ID, 
			token: token, 
			total: total,
			tickets: JSON.stringify(formattedTickets)
		};

		if (userId != null)
			sendData.userId = userId;
		else {
			sendData.firstName = formData.firstName;
			sendData.lastName = formData.lastName;
			sendData.email = formData.email;
			sendData.studentNumber = formData.studentNumber
		}

		if (isAdminGuestCheckout)
			sendData.isAdminGuestCheckout = true;

		if (isStudentCheckout)
			sendData.isStudent = true;

		if (typeof(coupon) != "undefined" && coupon.trim() != "" && !isStudentCheckout)
			sendData.coupon = coupon;

		$.ajax({
			url: '/api/orders/create',
			type: 'post',
			data: sendData,
			dataType: 'json',
			success: function(result) {				
				history.replaceState(null, '/order/' + result.hash, {checkout:true});
				this.dispatch(LanwarConstants.CHECKOUT_SUCCESS, result);
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

				if (errorStr.indexOf("Permission denied") > -1)
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {error: "Your session has timed out. The order was not recorded. Please login and create the order again."});
				
				this.dispatch(LanwarConstants.CHECKOUT_ERROR, {error: errorStr.indexOf("Permission denied") > -1 ? "" : errorStr});
			}.bind(this)
		});
	},
	initCheckout: function() {
		this.dispatch(LanwarConstants.INIT_CHECKOUT, {});
	},
	setAdminGuestCheckout: function(isAdminGuestCheckout) {
		this.dispatch(LanwarConstants.SET_ADMIN_GUEST_CHECKOUT, {isAdminGuestCheckout: isAdminGuestCheckout});
	},
	setStudentCheckout: function(isStudentCheckout) {
		this.dispatch(LanwarConstants.SET_STUDENT_CHECKOUT, {isStudentCheckout: isStudentCheckout});
	},
	resetCheckout: function() {
		this.dispatch(LanwarConstants.RESET_CHECKOUT, {});
	},
	updateTicketOptions: function(ticketKey, chosenOptions) {
		this.dispatch(LanwarConstants.UPDATE_TICKET_OPTIONS, {ticketKey: ticketKey, chosenOptions: chosenOptions});
	},
	updateTicketOptionsNotes: function(ticketKey, optionId, notes, fieldKey) {
		this.dispatch(LanwarConstants.UPDATE_TICKET_OPTIONS_NOTES, {ticketKey: ticketKey, optionId: optionId, notes: notes, fieldKey: fieldKey});
	},
	checkCoupon: function(coupon) {
		this.dispatch(LanwarConstants.CHECK_COUPON_LOADING);

		$.ajax({
			url: '/api/events/' + LanwarConstants.EVENT_ID + '/coupon/read',
			type: 'post',
			data: {coupon: coupon},
			success: function(result) {
				this.dispatch(LanwarConstants.CHECK_COUPON_SUCCESS, result);
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
				
				this.dispatch(LanwarConstants.CHECK_COUPON_ERROR, {error: errorStr});
			}.bind(this)
		});
	},
	resetCoupon: function() {
		this.dispatch(LanwarConstants.RESET_COUPON, {});
	}
};

module.exports = BuyTicketsActions;