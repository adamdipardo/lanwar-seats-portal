var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var AdminOrdersStore = Fluxxor.createStore({

	initialize: function() {
		this.isLoadingOrders = false;
		this.orders = [];
		this.ordersPaging = {};
		this.isLoadingOrderDetail = true;
		this.orderDetail = {};
		this.showLookupOrderNumberModal = false;
		this.isLoadingOrderNumberLookup = false;
		this.orderNumberLookupError = null;
		this.isLoadingOrdersSummary = false;
		this.summary = {};
		this.orderNumberLookup = null;

		this.bindActions(
			LanwarConstants.ADMIN_ORDERS_LOADING, this.onOrdersLoading,
			LanwarConstants.ADMIN_ORDERS_SUCCESS, this.onOrdersSuccess,
			LanwarConstants.ADMIN_ORDERS_ERROR, this.onOrdersError,
			LanwarConstants.ADMIN_ORDER_DETAIL_LOADING, this.onOrderDetailLoading,
			LanwarConstants.ADMIN_ORDER_DETAIL_SUCCESS, this.onOrderDetailSuccess,
			LanwarConstants.ADMIN_ORDER_DETAIL_ERROR, this.onOrderDetailError,
			LanwarConstants.ADMIN_CHECK_IN_ID_LOADING, this.onCheckInIdLoading,
			LanwarConstants.ADMIN_CHECK_IN_ID_SUCCESS, this.onCheckInIdSuccess,
			LanwarConstants.ADMIN_CHECK_IN_ID_ERROR, this.onCheckInIdError,
			LanwarConstants.OPEN_LOOKUP_ORDER_NUMBER_MODAL, this.onOpenLookupOrderNumberModal,
			LanwarConstants.LOOKUP_ORDER_NUMBER_LOADING, this.onLookupOrderNumberLoading,
			LanwarConstants.LOOKUP_ORDER_NUMBER_SUCCESS, this.onLookupOrderNumberSuccess,
			LanwarConstants.LOOKUP_ORDER_NUMBER_ERROR, this.onLookupOrderNumberError,
			LanwarConstants.DISMISS_LOOKUP_ORDER_NUMBER_MODAL, this.onDismissLookupOrderNumberModal,
			LanwarConstants.ADMIN_ORDERS_SUMMARY_LOADING, this.onOrdersSummaryLoading,
			LanwarConstants.ADMIN_ORDERS_SUMMARY_SUCCESS, this.onOrdersSummarySuccess,
			LanwarConstants.ADMIN_ORDERS_SUMMARY_ERROR, this.onOrdersSummaryError
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

		if (payload.error != 'Permission denied')
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

		if (payload.error != 'Permission denied')
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

		if (payload.error != 'Permission denied')
			alert(payload.error);

	},

	onOpenLookupOrderNumberModal: function(payload) {
		this.showLookupOrderNumberModal = true;
		this.orderNumberLookupError = null;
		this.emit("change");
	},

	onLookupOrderNumberLoading: function(payload) {
		this.isLoadingOrderNumberLookup = true;
		this.orderNumberLookupError = null;
		this.emit("change");
	},

	onLookupOrderNumberSuccess: function(payload) {
		this.isLoadingOrderNumberLookup = false;
		this.showLookupOrderNumberModal = false;
		this.isLoadingOrderDetail = false;
		this.orderDetail = payload;
		this.emit("change");
	},

	onLookupOrderNumberError: function(payload) {
		this.isLoadingOrderNumberLookup = false;
		this.orderNumberLookupError = payload.error;
		this.emit("change");
	},

	onDismissLookupOrderNumberModal: function(payload) {
		this.showLookupOrderNumberModal = false;
		this.emit("change");
	},

	onOrdersSummaryLoading: function(payload) {
		this.isLoadingOrdersSummary = true;
		this.summary = {
			total: 0,
			byoc: 0,
			smash: 0
		};
		this.emit("change");
	},

	onOrdersSummarySuccess: function(payload) {
		this.isLoadingOrdersSummary = false;
		this.summary = {
			total: payload.total,
			byoc: payload.tickets[0].numOrdered,
			smash: payload.tickets[1].numOrdered,
			smashOptions: [
				{
					name: 'Singles', 
					numOrdered: payload.tickets[1].options[0].numOrdered
				},
				{
					name: 'Doubles', 
					numOrdered: payload.tickets[1].options[1].numOrdered
				},
				{
					name: 'Doubles Partner', 
					numOrdered: payload.tickets[1].options[2].numOrdered
				}
			],
			spectator: payload.tickets[2].numOrdered
		};
		this.emit("change");
	},

	onOrdersSummaryError: function() {
		this.isLoadingOrdersSummary = false;
		this.emit("change");
	},

	getState: function() {
		return {
			isLoadingOrders: this.isLoadingOrders,
			orders: this.orders,
			ordersPaging: this.ordersPaging,
			isLoadingOrderDetail: this.isLoadingOrderDetail,
			orderDetail: this.orderDetail,
			showLookupOrderNumberModal: this.showLookupOrderNumberModal,
			isLoadingOrderNumberLookup: this.isLoadingOrderNumberLookup,
			orderNumberLookupError: this.orderNumberLookupError,
			summary: this.summary,
			isLoadingOrdersSummary: this.isLoadingOrdersSummary,
			orderNumberLookup: this.orderNumberLookup
		};
	}

});

module.exports = AdminOrdersStore;