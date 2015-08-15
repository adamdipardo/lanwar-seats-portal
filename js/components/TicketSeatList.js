var React = require('react');
var Fluxxor = require('fluxxor');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TicketSeatList = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("OrderStore", "RoomsStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var OrderStore = flux.store("OrderStore").getState();
		var RoomsStore = flux.store("RoomsStore").getState();

		return {
			order: OrderStore.order,
			rooms: RoomsStore.rooms
		};

	},

	closeModal: function() {

		this.props.onHideModal();

	},

	chooseTicket: function(ticketKey) {

		if (typeof(this.state.order.tickets[ticketKey].seat.seatKey) != "undefined" && this.state.order.tickets[ticketKey].seat.seatKey != "")
			this.getFlux().actions.OrderActions.cancelSeatReservation(this.state.order.tickets[ticketKey].seat.seatKey);

		this.getFlux().actions.OrderActions.makeSeatReservation(ticketKey, this.props.room, this.props.row, this.props.seat);
		this.props.onHideModal();

	},

	render: function() {

		if (this.props.show == false || !this.state.order.tickets || this.state.order.tickets.length == 0)
			return <span />

		var tickets = this.state.order.tickets;
		var rooms = this.state.rooms;

		var thisRoom = rooms[this.props.room];
		var thisRow = thisRoom.rows[this.props.row];
		var thisSeat = thisRow.seats[this.props.seat];

		var seatName = "Row " + thisRow.name + ", Seat " + thisSeat.name;

		var ticketRows = [];
		$.each(tickets, function(id, ticket) {
						
			if (ticket.seat.roomKey)
			{
				var thisRoom = this.state.rooms[ticket.seat.roomKey];
				var thisRow = thisRoom.rows[ticket.seat.rowKey];
				var thisSeat = thisRow.seats[ticket.seat.seatKey];
				var seatName = thisRoom.name + ", Row " + thisRow.name + " Seat " + thisSeat.name;
			}
			else if (ticket.seat.name)
				var seatName = ticket.seat.name;
			else
				var seatName = "Seat not yet assigned.";

			ticketRows.push(<li key={id} onClick={this.chooseTicket.bind(null, id)}><i className="fa fa-ticket"></i> <span className="ticket">{ticket.type}</span> <span className="seat">{seatName}</span></li>);

		}.bind(this));

		return (
			<Modal title={seatName} onRequestHide={this.closeModal} animation={false} dialogClassName="ticket-seat-list">
				<div className="modal-body">
					<p>Choose which ticket you would like to assign to this seat.</p>

					<ul>
						{ticketRows}
					</ul>
				</div>
				<div className='modal-footer'>
					<Button onClick={this.closeModal}>Cancel</Button>
				</div>
			</Modal>
		);

	}

});

module.exports = TicketSeatList;