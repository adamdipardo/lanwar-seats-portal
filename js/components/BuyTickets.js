var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('./Header');
var RegisterBasicFields = require('./RegisterBasicFields');
var TicketForm = require('./TicketForm');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var BuyTickets = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("UserAccountStore", "BuyTicketsStore")],

	getInitialState: function() {
		
		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();
		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn,
			user: UserAccountStore.user,
			isAdminGuestCheckout: BuyTicketsStore.isAdminGuestCheckout
		};

	},

	continueForm: function() {

		if ((this.state.isLoggedIn || this.refs.basicFormFields.isValid()) && this.refs.ticketForm.isValid())
		{
			if (!this.state.isLoggedIn || this.state.isAdminGuestCheckout) {
				var formData = this.refs.basicFormFields.getFormData();
				this.getFlux().actions.BuyTicketsActions.saveFormData(formData);
			}
			
			this.transitionTo('checkout');
		}

	},

	handleAdminGuestClick: function(e) {

		this.getFlux().actions.BuyTicketsActions.setAdminGuestCheckout(e.target.checked);

	},

	componentDidMount: function() {

		if (!this.context.router.getCurrentQuery().back)
			this.getFlux().actions.BuyTicketsActions.resetCheckout();

	},

	render: function() {

		var registerBasicFields = null;
		if (!this.state.isLoggedIn || this.state.isAdminGuestCheckout) {
			registerBasicFields = (
				<div>
					<RegisterBasicFields ref="basicFormFields"/>
				</div>
			);
		}

		// if logged in as admin, show option for guest ticket creation
		var adminGuestOption = null;
		if (this.state.isLoggedIn && this.state.user.type == 'admin') {
			var adminGuestOption = (
				<div>
					<div className="form-group">
						<div className="checkbox">
							<label>
								<input type="checkbox" onClick={this.handleAdminGuestClick} />
								<i className="fa fa-usd red"></i> This is a cash order.
							</label>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Buy Tickets</h2>
								<p>Here you can buy tickets and reserve seats for LANWAR X. To start, select the number of tickets that you would like to buy. We recommend buying tickets for friends/groups together to make seat reservation easiest.</p>
								{adminGuestOption}
								{registerBasicFields}		
								<TicketForm ref="ticketForm"/>
								<button className="pull-right btn btn-primary" onClick={this.continueForm}>Continue</button>
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = BuyTickets;