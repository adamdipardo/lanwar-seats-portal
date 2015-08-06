var LanwarConstants = require('../constants/LanwarConstants');

var AdminOrdersActions = {

	getOrders: function(pageNum) {
		this.dispatch(LanwarConstants.ADMIN_ORDERS_LOADING, {});

		$.ajax({
			url: '/api/orders/read',
			type: 'post',
			data: {page: pageNum || 1},
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_ORDERS_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.ADMIN_ORDERS_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	getOrderDetail: function(orderId) {
		this.dispatch(LanwarConstants.ADMIN_ORDER_DETAIL_LOADING, {});

		$.ajax({
			url: '/api/orders/'+orderId+'/read',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_ORDER_DETAIL_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.ADMIN_ORDER_DETAIL_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	checkInTicketById: function(ticketId) {
		this.dispatch(LanwarConstants.ADMIN_CHECK_IN_ID_LOADING, {ticketId: ticketId});

		$.ajax({
			url: '/api/tickets/check-in/id/'+ticketId,
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_CHECK_IN_ID_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.ADMIN_CHECK_IN_ID_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	}

};

module.exports = AdminOrdersActions;