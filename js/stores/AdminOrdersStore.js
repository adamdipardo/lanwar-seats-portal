var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var AdminOrdersStore = Fluxxor.createStore({

	initialize: function() {
		this.isLoadingOrders = false;
		this.orders = [];
		this.ordersPaging = {};
		this.isLoadingOrderDetail = true;
		this.orderDetail = {};

		this.bindActions(
			LanwarConstants.ADMIN_ORDERS_LOADING, this.onOrdersLoading,
			LanwarConstants.ADMIN_ORDERS_SUCCESS, this.onOrdersSuccess,
			LanwarConstants.ADMIN_ORDERS_ERROR, this.onOrdersError,
			LanwarConstants.ADMIN_ORDER_DETAIL_LOADING, this.onOrderDetailLoading,
			LanwarConstants.ADMIN_ORDER_DETAIL_SUCCESS, this.onOrderDetailSuccess,
			LanwarConstants.ADMIN_ORDER_DETAIL_ERROR, this.onOrderDetailError,
			LanwarConstants.ADMIN_CHECK_IN_ID_LOADING, this.onCheckInIdLoading,
			LanwarConstants.ADMIN_CHECK_IN_ID_SUCCESS, this.onCheckInIdSuccess,
			LanwarConstants.ADMIN_CHECK_IN_ID_ERROR, this.onCheckInIdError
		);
	},

	onOrdersLoading: function(payload) {

		this.isLoadingOrders = true;
		this.orders = [];
		this.emit("change");

	},

	onOrdersSuccess: function(payload) {

		this.isLoadingOrders = false;
		this.orders = payload.orders;
		this.ordersPaging = {
			from: payload.from,
			to: payload.to,
			currentPage: payload.currentPage,
			lastPage: payload.lastPage,
			count: payload.count
		};
		this.emit("change");

	},

	onOrdersError: function(payload) {

		this.isLoadingOrders = false;
		this.emit("change");
		alert(payload.error);

	},

	onOrderDetailLoading: function(payload) {

		this.isLoadingOrderDetail = true;
		this.orderDetail = {};
		this.emit("change");

	},

	onOrderDetailSuccess: function(payload) {

		this.isLoadingOrderDetail = false;
		this.orderDetail = payload;
		this.emit("change");

	},

	onOrderDetailError: function(payload) {

		this.isLoadingOrderDetail = false;
		this.emit("change");
		alert(payload.error);

	},

	onCheckInIdLoading: function(payload) {

		for (var i = 0; i < this.orderDetail.tickets.length; i++) {
			if (this.orderDetail.tickets[i].id == payload.ticketId) {
				this.orderDetail.tickets[i].isLoadingCheckIn = true;
			}
		}
		this.emit("change");

	},

	onCheckInIdSuccess: function(payload) {

		for (var i = 0; i < this.orderDetail.tickets.length; i++) {
			if (this.orderDetail.tickets[i].id == payload.id) {
				this.orderDetail.tickets[i].checkInDate = payload.checkInDate;
				this.orderDetail.tickets[i].isCheckedIn = payload.isCheckedIn;
				this.orderDetail.tickets[i].isLoadingCheckIn = false;
			}
		}
		this.emit("change");

	},

	onCheckInIdError: function(payload) {

		for (var i = 0; i < this.orderDetail.tickets.length; i++) {
			if (this.orderDetail.tickets[i].id == payload.ticketId) {
				this.orderDetail.tickets[i].isLoadingCheckIn = false;
			}
		}
		this.emit("change");
		alert(payload.error);

	},

	getState: function() {
		return {
			isLoadingOrders: this.isLoadingOrders,
			orders: this.orders,
			ordersPaging: this.ordersPaging,
			isLoadingOrderDetail: this.isLoadingOrderDetail,
			orderDetail: this.orderDetail
		};
	}

});

module.exports = AdminOrdersStore;