var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CheckoutTicket = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("OrderStore")],

	handleLabelClick: function(ticket, e) {

		this.props.onLabelClick(ticket);

	},

	getStateFromFlux: function() {

		return {};

	},

	render: function() {

		var ticket = this.props.ticket;

		// get ticket label
		var ticketLabel;
		if (!ticket.isLabelLoading)
			ticketLabel = (<span>{ticket.label || "No Label"} <small><a className="pointer" onClick={this.handleLabelClick.bind(this, ticket)}>({ticket.label ? "change" : "set"})</a></small></span>);
		else
			ticketLabel = (<span>Updating... <i className="fa fa-circle-o-notch fa-spin"></i></span>)

		// get list of options
		var options = [];
		if (ticket.options.length > 0) {
			for (var i = 0; i < ticket.options.length; i++)
				options.push(ticket.options[i].name);
		}

		// figure out best seat message
		var seat;
		if (ticket.seat.name)
			seat = ticket.seat.name;
		else if (ticket.canBookSeat == true)
			seat = <span>No Seat Chosen Yet</span>;
		else
			seat = <span>Seat not available for this ticket.</span>;

		return (
			<tr>
				<td>{ticket.id}</td>
				<td>{ticket.type}</td>
				<td>{options.join(', ')}</td>
				<td>{ticketLabel}</td>
				<td>{seat}</td>
			</tr>
		);

	}	

});

module.exports = CheckoutTicket;