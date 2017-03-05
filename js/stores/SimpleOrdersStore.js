var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');
var _ = require('underscore');

var SimpleOrdersStore = Fluxxor.createStore({
	initialize: function() {
		this.orders = {};
		this.isLoadingOrders = false;
		this.getOrdersError = null;

		this.bindActions(
			LanwarConstants.LOAD_SIMPLE_ORDERS, this.onLoadOrders,
			LanwarConstants.LOAD_SIMPLE_ORDERS_SUCCESS, this.onLoadOrdersSuccess,
			LanwarConstants.LOAD_SIMPLE_ORDERS_FAILURE, this.onLoadOrdersFailure
		);
	},

	onLoadOrders: function(payload) {
		this.isLoadingOrders = true;
		this.getOrdersError = null;
		this.emit("change");
	},

	onLoadOrdersSuccess: function(payload) {
		this.isLoadingOrders = false;
		var counter = 0;
		this.orders = payload.orders.reduce(function(acc, order){
			// var clientId = order.id;
			acc[counter++] = order;
			return acc;
		}, {});
		this.emit("change");
	},

	onLoadOrdersFailure: function(payload) {
		this.isLoadingOrders = false;
		this.getOrdersError = payload.error;
		this.emit("change");
	},

	getState: function() {
		return {
			isLoadingOrders: this.isLoadingOrders,
			getOrdersError: this.getOrdersError,
			orders: this.orders
		};
	}
});

module.exports = SimpleOrdersStore;
