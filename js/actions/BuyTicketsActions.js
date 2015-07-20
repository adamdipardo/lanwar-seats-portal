var LanwarConstants = require('../constants/LanwarConstants');

var BuyTicketsActions = {
	changeTicketQuantity: function(ticketType, quantity) {
		this.dispatch(LanwarConstants.CHANGE_TICKET_QUANTITY, {ticketType: ticketType, quantity: quantity});
	},
	saveFormData: function(formData) {
		this.dispatch(LanwarConstants.SAVE_TICKET_FORM_DATA, {formData: formData});
	},
	/*assignSeatToTicket: function(ticketKey, roomKey, rowKey, seatKey) {
		this.dispatch(LanwarConstants.ASSIGN_SEAT_TO_TICKET, {ticketKey: ticketKey, roomKey: roomKey, rowKey: rowKey, seatKey: seatKey});
	},*/
	makeSeatReservation: function(ticketKey, roomKey, rowKey, seatKey) {
		this.dispatch(LanwarConstants.LOAD_MAKE_RESERVATION);

		$.ajax({
			url: LanwarConstants.RESERVATION_API + "/seat/" + seatKey + "/reserve",
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_MAKE_RESERVATION_SUCCESS, {ticketKey: ticketKey, roomKey: roomKey, rowKey: rowKey, seatKey: seatKey, sessionId: result.sessId});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_MAKE_RESERVATION, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	cancelSeatReservation: function(seatKey, cancellingAll) {
		if (typeof(cancellingAll) != "undefined" && cancellingAll == true)
			this.dispatch(LanwarConstants.ALL_SEATS_UNRESERVED, {});

		$.ajax({
			url: LanwarConstants.RESERVATION_API + "/seat/" + seatKey + "/unreserve",
			type: 'post',
			success: function(result) {
				// 
			},
			error: function(xhr) {
				// 
			}
		});
	},
	checkout: function(formData, tickets, total, token, sessionId) {

		var formattedTickets = [];
		$.each(tickets, function(index, ticket) {
			formattedTickets.push({id: ticket.id, seat: ticket.seat.seatKey});
		});

		$.ajax({
			url: '/api/orders/create',
			type: 'post',
			data: {eventId: 1, token: token, total: total, firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password, tickets: JSON.stringify(formattedTickets), reservationSessionId: sessionId},
			dataType: 'json',
			success: function(result) {
				this.dispatch(LanwarConstants.CHECKOUT_SUCCESS, {});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.CHECKOUT_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	}
};

module.exports = BuyTicketsActions;