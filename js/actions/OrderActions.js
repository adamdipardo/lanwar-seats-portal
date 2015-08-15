var LanwarConstants = require('../constants/LanwarConstants');

var OrderActions = {
	getOrder: function(hash) {
		this.dispatch(LanwarConstants.GET_ORDER_LOADING);

		$.ajax({
			url: "/api/orders/" + hash + "/read",
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.GET_ORDER_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.GET_ORDER_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	makeSeatReservation: function(ticketKey, roomKey, rowKey, seatKey) {
		this.dispatch(LanwarConstants.LOAD_MAKE_RESERVATION);

		$.ajax({
			url: LanwarConstants.RESERVATION_API + "/seat/" + seatKey + "/reserve",
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_MAKE_RESERVATION_SUCCESS, {ticketKey: ticketKey, roomKey: roomKey, rowKey: rowKey, seatKey: seatKey, sessionId: result.sessId});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_MAKE_RESERVATION_FAILURE, {error: JSON.parse(xhr.responseText).error});
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
	bookSeats: function(orderHash, tickets, reservationSessionId, router) {
		this.dispatch(LanwarConstants.BOOK_SEATS_LOADING, {});

		reservedTickets = [];
		for (var i = 0; i < tickets.length; i++) {
			if (tickets[i].seat.seatKey && tickets[i].seat.seatKey != tickets[i].seat.id)
				reservedTickets.push({id: tickets[i].id, seat: tickets[i].seat.seatKey});
		}

		$.ajax({
			url: '/api/orders/' + orderHash + '/tickets/book',
			type: 'post',
			data: {tickets: JSON.stringify(reservedTickets), reservationSessionId: reservationSessionId},
			success: function(result) {
				this.dispatch(LanwarConstants.BOOK_SEATS_SUCCESS, result);
				router.transitionTo('/order/' + orderHash);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.BOOK_SEATS_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	setLabel: function(orderHash, ticketId, label) {
		this.dispatch(LanwarConstants.SET_LABEL_LOADING, {ticketId: ticketId});

		$.ajax({
			url: '/api/orders/' + orderHash + '/tickets/' + ticketId + '/label/update',
			type: 'post',
			data: {label: label},
			success: function(result) {
				this.dispatch(LanwarConstants.SET_LABEL_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.SET_LABEL_ERROR, {ticketId: ticketId, error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	}
};

module.exports = OrderActions;