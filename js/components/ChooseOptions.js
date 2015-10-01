var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('./Header');
var Footer = require('./Footer');
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
			tickets: BuyTicketsStore.tickets,
			isStudentCheckout: BuyTicketsStore.isStudentCheckout
		};

	},

	handleClickBack: function() {

		this.transitionTo('/', {}, {back: true});

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
			else if (ticket.chosenOptions.length > 0) {
				for (var i = 0; i < ticket.chosenOptions.length; i++) {
					console.log(ticket.chosenOptions[i]);
					console.log(ticket.chosenOptions[i].notes);
					if (typeof(ticket.chosenOptions[i].notes) == "undefined" || ticket.chosenOptions[i].notes.trim() == "") {
						areTicketsValid = false;
						return false;
					}
				}				
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
				ticketOptionRows.unshift(<ChooseTicketOptionsRow ticket={ticket} key={index} ticketKey={index} isStudent={this.state.isStudentCheckout}/>);
			}
			else {
				ticketOptionRows.push(<ChooseTicketOptionsRow ticket={ticket} key={index} ticketKey={index} isStudent={this.state.isStudentCheckout}/>);
			}
		}.bind(this));

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
								<div className="buttons-container">
									<button type="button" className="btn btn-default" onClick={this.handleClickBack}>Back</button>
									<button type="submit" className="btn btn-primary pull-right">Continue</button>
								</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);

	}
});

module.exports = ChooseOptions;