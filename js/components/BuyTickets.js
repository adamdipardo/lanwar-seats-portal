var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('./Header');
var Footer = require('./Footer');
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
			isAdminGuestCheckout: BuyTicketsStore.isAdminGuestCheckout,
			isStudentCheckout: BuyTicketsStore.isStudentCheckout,
			tickets: BuyTicketsStore.tickets
		};

	},

	continueForm: function(e) {

		e.preventDefault();

		if ((this.state.isLoggedIn || this.refs.basicFormFields.isValid()) && this.refs.ticketForm.isValid())
		{
			if (!this.state.isLoggedIn || this.state.isAdminGuestCheckout) {
				var formData = this.refs.basicFormFields.getFormData();
				this.getFlux().actions.BuyTicketsActions.saveFormData(formData);
			}

			var chooseOptions = false;
			$.each(this.state.tickets, function(index, ticket) {
				if (ticket.options.length > 0) {
					chooseOptions = true;
					return false;
				}
			});
			
			if (chooseOptions)
				this.transitionTo('choose-options');
			else
				this.transitionTo('checkout');
		}

	},

	handleAdminGuestClick: function(e) {

		this.getFlux().actions.BuyTicketsActions.setAdminGuestCheckout(e.target.checked);

		if (e.target.checked == false && this.state.isStudentCheckout)
			this.getFlux().actions.BuyTicketsActions.setStudentCheckout(false);

	},

	handleStudentClick: function(e) {
	
		this.getFlux().actions.BuyTicketsActions.setStudentCheckout(e.target.checked);

		if (e.target.checked == true)
			this.getFlux().actions.BuyTicketsActions.setAdminGuestCheckout(true);

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
								<input type="checkbox" checked={this.state.isAdminGuestCheckout} onClick={this.handleAdminGuestClick} />
								<i className="fa fa-usd red"></i> This is a cash order.
							</label>
						</div>
						<div className="checkbox">
							<label>
								<input type="checkbox" checked={this.state.isStudentCheckout} onClick={this.handleStudentClick} />
								<i className="fa fa-graduation-cap red"></i> Apply a student discount ($5 off each ticket)
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

								<form onSubmit={this.continueForm}>
								{adminGuestOption}
								{registerBasicFields}		
								<TicketForm ref="ticketForm" isStudent={this.state.isStudentCheckout}/>
								<button type="submit" className="pull-right btn btn-primary">Continue</button>
								</form>
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
});

module.exports = BuyTickets;