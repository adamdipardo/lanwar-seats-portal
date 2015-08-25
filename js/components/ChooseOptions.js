var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('./Header');
var ChooseTicketOptionsRow = require('./ChooseTicketOptionsRow');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ChooseOptions = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("BuyTicketsStore")],

	getInitialState: function() {

		return {
			areTicketsValid: true,
			continueError: ""
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();
		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			tickets: BuyTicketsStore.tickets
		};

	},

	handleContinueClick: function(e) {

		e.preventDefault();

		// only show continue button if tickets are all valid
		var areTicketsValid = true;
		$.each(this.state.tickets, function(index, ticket) {
			if (ticket.isOptionRequired == true && (typeof(ticket.chosenOptions) == "undefined" || ticket.chosenOptions.length == 0)) {
				areTicketsValid = false;
				return false;
			}
		});

		this.setState({areTicketsValid: areTicketsValid, continueError: !areTicketsValid ? 'Please select an option for all tickets above, where an option is required.' : '' });

		if (areTicketsValid)
			this.context.router.transitionTo('checkout');

	},

	render: function() {

		var ticketOptionRows = [];
		var numTicketsWithOptions = 0;
		$.each(this.state.tickets, function(index, ticket) {
			if (ticket.options.length > 0) {
				numTicketsWithOptions++;
				ticketOptionRows.unshift(<ChooseTicketOptionsRow ticket={ticket} key={index} ticketKey={index}/>);
			}
			else {
				ticketOptionRows.push(<ChooseTicketOptionsRow ticket={ticket} key={index} ticketKey={index}/>);
			}
		});

		if (numTicketsWithOptions == 0)
			this.context.router.transitionTo('/');

		

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Choose Options for your Tickets</h2>

								<form onSubmit={this.handleContinueClick}>
								{ticketOptionRows}
								<p className="error options-error">{this.state.continueError}</p>
								<button type="submit" className="btn btn-primary pull-right">Continue</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);

	}
});

module.exports = ChooseOptions;