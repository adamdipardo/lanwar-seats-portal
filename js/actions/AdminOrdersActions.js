var LanwarConstants = require('../constants/LanwarConstants');
var history = require('../history');

var AdminOrdersActions = {

	getOrders: function(pageNum, sortKey, sortDirection, filters) {
		this.dispatch(LanwarConstants.ADMIN_ORDERS_LOADING, {page: pageNum || 1});

		var ordersData = {
			page: pageNum || 1, 
			sort: sortKey || 'lastName', 
			sortDirection: sortDirection || 'asc',
			eventId: LanwarConstants.EVENT_ID
		};

		if (typeof(filters) != "undefined") {
			ordersData.paymentMethod = filters.paymentMethod;
			ordersData.ticketTypes = JSON.stringify(filters.ticketTypes);
			ordersData.startDate = filters.startDate;
			ordersData.endDate = filters.endDate;
			ordersData.name = filters.name;
		}

		$.ajax({
			url: '/api/orders/read',
			type: 'post',
			data: ordersData,
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_ORDERS_SUCCESS, result);
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

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.ADMIN_ORDERS_ERROR, {error: errorStr});
			}.bind(this)
		});
	},
	getOrdersSummary: function() {
		this.dispatch(LanwarConstants.ADMIN_ORDERS_SUMMARY_LOADING, {});

		$.ajax({
			url: '/api/orders/summary/read',
			type: 'post',
			data: {eventId: LanwarConstants.EVENT_ID},
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_ORDERS_SUMMARY_SUCCESS, result);
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

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.ADMIN_ORDERS_SUMMARY_ERROR, {error: errorStr});
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
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "Sorry, there was an error. Please try again later.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.ADMIN_ORDER_DETAIL_ERROR, {error: errorStr});
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
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "Sorry, there was an error. Please try again later.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {error: "Your session has timed-out. The ticket was not checked-in. Please login again."});
				else				
					this.dispatch(LanwarConstants.ADMIN_CHECK_IN_ID_ERROR, {error: errorStr == "Permission denied" ? "" : errorStr});
			}.bind(this)
		});
	},
	openLookupOrderNumberModal: function() {
		this.dispatch(LanwarConstants.OPEN_LOOKUP_ORDER_NUMBER_MODAL, {});
	},
	lookupOrderNumber: function(orderNumber) {
		this.dispatch(LanwarConstants.LOOKUP_ORDER_NUMBER_LOADING, {});

		$.ajax({
			url: '/api/orders/' + orderNumber + '/read',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOOKUP_ORDER_NUMBER_SUCCESS, result);
				history.replaceState(null, '/admin/orders/' + orderNumber, {'from-cache':true});
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

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				
				this.dispatch(LanwarConstants.LOOKUP_ORDER_NUMBER_ERROR, {error: errorStr == "Permission denied" ? "" : errorStr});
			}.bind(this)
		});
	},
	dismissLookupOrderNumberModal: function() {
		this.dispatch(LanwarConstants.DISMISS_LOOKUP_ORDER_NUMBER_MODAL, {});
	},
	dismissReSendEmailModal: function() {
		this.dispatch(LanwarConstants.DISMISS_RE_SEND_EMAIL_MODAL, {});
	},
	openReSendEmailModal: function() {
		this.dispatch(LanwarConstants.OPEN_RE_SEND_EMAIL_MODAL, {});
	},
	reSendEmail: function(orderId, email) {
		this.dispatch(LanwarConstants.RE_SEND_EMAIL_LOADING, {});

		$.ajax({
			url: '/api/orders/' + orderId + '/email/create',
			data: {email: email},
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.RE_SEND_EMAIL_SUCCESS, result);
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

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				
				this.dispatch(LanwarConstants.RE_SEND_EMAIL_ERROR, {error: errorStr == "Permission denied" ? "" : errorStr});
			}.bind(this)
		});
	},
	resetReSendEmailMessage: function() {
		this.dispatch(LanwarConstants.RESET_RE_SEND_EMAIL_MESSAGE, {});
	}
};

module.exports = AdminOrdersActions;