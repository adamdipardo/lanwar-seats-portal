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

		var ticketLabel;
		if (!ticket.isLabelLoading)
			ticketLabel = (<span>{ticket.label || "No Label"} <small><a className="pointer" onClick={this.handleLabelClick.bind(this, ticket)}>({ticket.label ? "change" : "set"})</a></small></span>);
		else
			ticketLabel = (<span>Updating... <i className="fa fa-circle-o-notch fa-spin"></i></span>)

		return (
			<tr>
				<td>{ticket.id}</td>
				<td>{ticket.type}</td>
				<td>{ticketLabel}</td>
				<td>{ticket.seat.name || <span>No Seat Chosen Yet</span>}</td>
			</tr>
		);

	}	

});

module.exports = CheckoutTicket;