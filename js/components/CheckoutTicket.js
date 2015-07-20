var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);

var CheckoutTicket = React.createClass({
	mixins: [FluxMixin],

	render: function() {

		var ticket = this.props.ticket;

		var flux = this.getFlux();
		var RoomsStore = flux.store("RoomsStore").getState();
		var room = RoomsStore.rooms[ticket.seat.roomKey];
		var row = room.rows[ticket.seat.rowKey];
		var seat = row.seats[ticket.seat.seatKey];

		var prettySeatName = room.name + " Row " + row.name + " Seat " + seat.name;

		return (
			<tr>
				<td>{ticket.name}</td>
				<td>${ticket.price.toFixed(2)}</td>
				<td>{prettySeatName}</td>
			</tr>
		);

	}	

});

module.exports = CheckoutTicket;