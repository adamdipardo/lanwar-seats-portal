var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;

var Header = require('./Header');
var Footer = require('./Footer');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TicketEmails = React.createClass({
	mixins: [FluxMixin, History, StoreWatchMixin("BuyTicketsStore")],

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
			isStudentCheckout: BuyTicketsStore.isStudentCheckout,
			formData: BuyTicketsStore.formData
		};

	},

	handleClickBack: function() {

		this.history.pushState(null, '/', {back: true});

	},

	componentDidMount: function() {
		
		$.each(this.state.tickets, function(index, ticket) {
			this.getFlux().actions.BuyTicketsActions.updateTicketOptionsNotes(index, ticket.options[0].id, this.state.formData.email, "notes");			
			return false;
		}.bind(this));

	},

	handleContinueClick: function(e) {

		e.preventDefault();

		// only show continue button if tickets are all valid
		var areTicketsValid = true;
		var hasDoubles;
		var hasDoublesPartner;
		var hasBothDoubles = false;
		$.each(this.state.tickets, function(index, ticket) {
			if (ticket.isOptionRequired == true && (typeof(ticket.chosenOptions) == "undefined" || ticket.chosenOptions.length == 0)) {
				areTicketsValid = false;
				return false;
			}
			else if (typeof(ticket.chosenOptions) != "undefined" && ticket.chosenOptions.length > 0) {
				for (var i = 0; i < ticket.chosenOptions.length; i++) {
					if (typeof(ticket.chosenOptions[i].notes) == "undefined" || ticket.chosenOptions[i].notes.trim() == "") {
						areTicketsValid = false;
						return false;
					}

				}				
			}
		});

		var errorStr;
		errorStr = 'Please enter an email address for all tickets above.';

		this.setState({areTicketsValid: areTicketsValid, continueError: !areTicketsValid ? errorStr : '' });

		if (areTicketsValid)
			this.history.pushState(null, '/checkout');

	},

	handleNotesChange: function(ticket, key, e) {

		this.getFlux().actions.BuyTicketsActions.updateTicketOptionsNotes(key, ticket.options[0].id, e.target.value, "notes");

	},

	render: function() {

		var ticketOptionRows = [];
		var numTicketsWithOptions = 0;
		$.each(this.state.tickets, function(index, ticket) {
			numTicketsWithOptions++;

			var option = ticket.options[0];

			var notes;
			if (typeof(ticket.chosenOptions) != "undefined" && typeof(ticket.chosenOptions[0]) != "undefined")
				notes = ticket.chosenOptions[0].notes;

			ticketOptionRows.unshift((
				<table className="table table-ticket-options email-only" key={index}>
				<tbody>
				<tr>
					<td><span className="title">{ticket.name} Ticket</span></td>
				</tr>
				<tr>
					<td>
						<span className="title option">{option.name}</span>
						<div className="description option">{option.description}</div>
						<div className="form-group">
							<label className="sr-only">Email Address</label>
							<input type="text" name="notes" className="form-control" placeholder="Email Address" onChange={this.handleNotesChange.bind(this, ticket, index)} value={notes}/>
						</div>
					</td>
				</tr>
				</tbody>
				</table>
			));
		}.bind(this));

		if (numTicketsWithOptions == 0)
			this.history.pushState(null, '/');		

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Set Emails for your tickets</h2>

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

module.exports = TicketEmails;