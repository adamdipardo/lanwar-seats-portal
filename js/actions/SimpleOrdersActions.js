var LanwarConstants = require('../constants/LanwarConstants');

var SimpleOrdersActions = {
	loadOrders: function() {

		this.dispatch(LanwarConstants.LOAD_SIMPLE_ORDERS);

		$.ajax({
			url: '/api/orders/simple/read',
			type: 'post',
			data: {eventId : LanwarConstants.EVENT_ID},
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_SIMPLE_ORDERS_SUCCESS, {orders: result.orders});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_SIMPLE_ORDERS_FAILURE, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});

	}
};

module.exports = SimpleOrdersActions;
