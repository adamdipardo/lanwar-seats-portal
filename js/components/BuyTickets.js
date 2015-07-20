var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('./Header');
var RegisterBasicFields = require('./RegisterBasicFields');
var TicketForm = require('./TicketForm');

var FluxMixin = Fluxxor.FluxMixin(React);

var BuyTickets = React.createClass({
	mixins: [FluxMixin, Navigation],

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

		// return flux.store("TicketTypesStore").getState();

	},

	continueForm: function() {

		if (this.refs.basicFormFields.isValid() && this.refs.ticketForm.isValid())
		{
			var formData = this.refs.basicFormFields.getFormData();
			this.getFlux().actions.BuyTicketsActions.saveFormData(formData);
			this.transitionTo('select-seats');
		}

	},

	render: function() {
		return (
			<div>
				<Header />
				<div className="container body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Buy Tickets</h2>
								<RegisterBasicFields ref="basicFormFields"/>					
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