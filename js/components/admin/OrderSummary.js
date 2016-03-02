var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OrderSummary = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOrdersStore")],

	getInitialState: function() {

		return {
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminOrdersStore = flux.store("AdminOrdersStore").getState();

		return {
			isLoadingOrdersSummary: AdminOrdersStore.isLoadingOrdersSummary,
			summary: AdminOrdersStore.summary
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.AdminOrdersActions.getOrdersSummary();

	},

	handleRefreshClick: function() {

		this.getFlux().actions.AdminOrdersActions.getOrdersSummary();		

	},

	render: function() {

		if (!this.state.isLoadingOrdersSummary) {
			return (
				<div className="row orders-summary simple">
					<div className="col-md-12 total">
						<h2>{this.state.summary.total}</h2>
						<h3>Tickets Sold</h3>
					</div>
				</div>
			);
		}
		else {
			return (<div className="row orders-summary"></div>);
		}

	}
});

module.exports = OrderSummary;