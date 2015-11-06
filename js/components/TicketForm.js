var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TicketTypeRow = require('./TicketTypeRow');

var TicketForm = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("TicketTypesStore", "BuyTicketsStore")],

	getInitialState: function() {
		return {
			error: null
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var TicketTypesStore = flux.store("TicketTypesStore").getState();
		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			ticketTypes: TicketTypesStore.ticketTypes,
			totalPrice: BuyTicketsStore.totalPrice,
			tickets: BuyTicketsStore.tickets
		}

	},

	componentDidMount: function() {

		this.getFlux().actions.TicketTypesActions.loadTicketTypes();

	},

	isValid: function() {

		var hasTickets = false;
		for (var ticket in this.state.tickets)
		{
			hasTickets = true;
			break;
		}

		if (!hasTickets)
			this.setState({error: "Please select at least one ticket to buy."});
		else
			this.setState({error: null});

		return hasTickets;

	},

	render: function() {
		var ticketTypes = this.state.ticketTypes;

		var errorString = this.state.error !== null ? <p className="has-error"><span className="help-block">{this.state.error}</span></p> : "";

		// get count of each ticket type selected
		var ticketTypesSelected = {};
		$.each(this.state.tickets, function(index, ticket) {
			if (ticket.id in ticketTypesSelected)
				ticketTypesSelected[ticket.id]++;
			else
				ticketTypesSelected[ticket.id] = 1;
		});

		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<table className="table ticket-types">
						<thead>
						<tr>
							<th width="60%">Ticket</th>
							<th width="20%">Quantity</th>
							<th width="20%">Price</th>
						</tr>
						</thead>
						<tbody>
							{Object.keys(ticketTypes).map(function(id) {
								return <TicketTypeRow key={id} ticketType={ticketTypes[id]} initialChosen={ticketTypesSelected[ticketTypes[id].id]} isStudent={this.props.isStudent} />
							}.bind(this))}
						</tbody>
						<tfoot>
						<tr>
							<td></td>
							<td>Total:</td>
							<td><strong>${this.state.totalPrice.toFixed(2)}</strong></td>
						</tr>
						</tfoot>
						</table>
						{errorString}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = TicketForm;