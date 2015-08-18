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
	},
	openLookupOrderNumberModal: function() {
		this.dispatch(LanwarConstants.OPEN_LOOKUP_ORDER_NUMBER_MODAL, {});
	},
	lookupOrderNumber: function(orderNumber, router) {
		this.dispatch(LanwarConstants.LOOKUP_ORDER_NUMBER_LOADING, {});

		$.ajax({
			url: '/api/orders/' + orderNumber + '/read',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOOKUP_ORDER_NUMBER_SUCCESS, result);
				router.transitionTo('/admin/orders/' + orderNumber, {}, {'from-cache':true});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOOKUP_ORDER_NUMBER_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	dismissLookupOrderNumberModal: function() {
		this.dispatch(LanwarConstants.DISMISS_LOOKUP_ORDER_NUMBER_MODAL, {});
	}
};

module.exports = AdminOrdersActions;