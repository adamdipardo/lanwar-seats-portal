var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('./Header');
var RegisterBasicFields = require('./RegisterBasicFields');
var TicketForm = require('./TicketForm');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var BuyTickets = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("UserAccountStore")],

	getInitialState: function() {
		return {
			fields: [
				{
					name: "firstName",
					prettyName: "First Name",
					type: "text",
					value: "",
					isRequired: true
				}
			]
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn
		};

	},

	continueForm: function() {

		if ((this.state.isLoggedIn || this.refs.basicFormFields.isValid()) && this.refs.ticketForm.isValid())
		{
			if (!this.state.isLoggedIn) {
				var formData = this.refs.basicFormFields.getFormData();
				this.getFlux().actions.BuyTicketsActions.saveFormData(formData);
			}
			
			this.transitionTo('select-seats');
		}

	},

	render: function() {

		var registerBasicFields = null;
		if (!this.state.isLoggedIn) {
			registerBasicFields = (
				<div>
					<p><i className="fa fa-exclamation red"></i> Login above if you already have an account, or fill out the fields below to create one.</p>
					<RegisterBasicFields ref="basicFormFields"/>
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