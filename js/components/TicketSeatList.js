var React = require('react');
var Fluxxor = require('fluxxor');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TicketSeatList = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore", "RoomsStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();
		var RoomsStore = flux.store("RoomsStore").getState();

		return {
			tickets: BuyTicketsStore.tickets,
			rooms: RoomsStore.rooms
		};

	},

	closeModal: function() {

		this.props.onHideModal();

	},

	chooseTicket: function(ticketKey) {

		if (typeof(this.state.tickets[ticketKey].seat.seatKey) != "undefined" && this.state.tickets[ticketKey].seat.seatKey != "")
			this.getFlux().actions.BuyTicketsActions.cancelSeatReservation(this.state.tickets[ticketKey].seat.seatKey);

		this.getFlux().actions.BuyTicketsActions.makeSeatReservation(ticketKey, this.props.room, this.props.row, this.props.seat);
		this.props.onHideModal();

	},

	render: function() {

		if (this.props.show == false)
			return <span />

		var tickets = this.state.tickets;
		var rooms = this.state.rooms;

		var thisRoom = rooms[this.props.room];
		var thisRow = thisRoom.rows[this.props.row];
		var thisSeat = thisRow.seats[this.props.seat];

		var seatName = "Row " + thisRow.name + ", Seat " + thisSeat.name;

		return (
			<Modal title={seatName} onRequestHide={this.closeModal} animation={false} dialogClassName="ticket-seat-list">
				<div className="modal-body">
					<p>Choose which ticket you would like to assign to this seat.</p>

					<ul>
					{Object.keys(tickets).map(function(id) {

						// console.log(id);
						// console.log(tickets[id]);
						
						if (tickets[id].seat.roomKey)
						{
							var thisRoom = this.state.rooms[tickets[id].seat.roomKey];
							var thisRow = thisRoom.rows[tickets[id].seat.rowKey];
							var thisSeat = thisRow.seats[tickets[id].seat.seatKey];
							var seatName = thisRoom.name + ", Row " + thisRow.name + " Seat " + thisSeat.name;
						}
						else
							var seatName = "Unassigned";
						return (
							<li key={id} onClick={this.chooseTicket.bind(null, id)}><i className="fa fa-ticket"></i> <span className="ticket">{tickets[id].name}</span> <span className="seat">{seatName}</span></li>
						);
					}.bind(this))}
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