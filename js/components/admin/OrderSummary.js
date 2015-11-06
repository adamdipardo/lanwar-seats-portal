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
			var smashOptions = [];

			var smashSingles;
			var smashDoubles;
			var smashDoublesPartner;
			if (typeof(this.state.summary.smashOptions) != "undefined") {
				smashSingles = this.state.summary.smashOptions[0].numOrdered;
				smashDoubles = this.state.summary.smashOptions[1].numOrdered;
				smashDoublesPartner = this.state.summary.smashOptions[2].numOrdered;
			}

			var meleeSingles;
			var meleeDoubles;
			var meleeDoublesPartner;
			if (typeof(this.state.summary.meleeOptions) != "undefined") {
				meleeSingles = this.state.summary.meleeOptions[0].numOrdered;
				meleeDoubles = this.state.summary.meleeOptions[1].numOrdered;
				meleeDoublesPartner = this.state.summary.meleeOptions[2].numOrdered;
			}

			return (
				<div className="row orders-summary">
					<div className="col-md-1"></div>
					<div className="col-md-2 total">
						<h2>{this.state.summary.total}</h2>
						<h3>Tickets Sold</h3>
					</div>
					<div className="col-md-1 ticket-type">
						<h2>{this.state.summary.byoc}</h2>
						<h3>BYOC</h3>
					</div>
					<div className="col-md-1 ticket-type smash">
						<h2>{this.state.summary.smash}</h2>
						<h3>Smash4</h3>
					</div>
					<div className="col-md-2 options">
						<h3>Singles <span className="number">{smashSingles}</span></h3>
						<h3>Doubles <span className="number">{smashDoubles}</span></h3>
						<h3>Doubles Partner <span className="number">{smashDoublesPartner}</span></h3>
					</div>
					<div className="col-md-1 ticket-type">
						<h2>{this.state.summary.melee}</h2>
						<h3>Melee</h3>
					</div>
					<div className="col-md-2 options">
						<h3>Singles <span className="number">{meleeSingles}</span></h3>
						<h3>Doubles <span className="number">{meleeDoubles}</span></h3>
						<h3>Doubles Partner <span className="number">{meleeDoublesPartner}</span></h3>
					</div>
					<div className="col-md-1 ticket-type">
						<h2>{this.state.summary.spectator}</h2>
						<h3>Spec</h3>
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