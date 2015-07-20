var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var moment = require('moment');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var RoomsList = require('./RoomsList');
var SeatMap = require('./SeatMap');
var TicketSeatList = require('./TicketSeatList');
var ReservationLoading = require('./ReservationLoading');
var CheckoutTimer = require('./CheckoutTimer');
var Header = require('./Header');

var SelectSeats = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore"), Navigation],

	getInitialState: function() {
		return {
			showTicketSeatList: false,
			room: null,
			isContinuing: false
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			tickets: BuyTicketsStore.tickets,
			isLoadingReservation: BuyTicketsStore.isLoadingReservation,
			reservationError: BuyTicketsStore.reservationError,
			checkoutExpireTime: BuyTicketsStore.checkoutExpireTime
		};

	},

	handleClickBack: function() {

		var response = confirm("Are you sure you want to go back? Any reserved seats will be lost.");

		if (response == true) {
			this.transitionTo('/');
		}

	},

	handleSeatClick: function(roomKey, rowKey, seatKey) {

		this.setState({showTicketSeatList: true, selectedRoom: roomKey, selectedRow: rowKey, selectedSeat: seatKey});

	},

	hideTicketSeatList: function() {

		this.setState({showTicketSeatList: false, selectedRoom: null, selectedRow: null, selectedSeat: null});

	},

	handleRoomSelect: function(roomKey) {

		this.setState({room: roomKey});

	},

	handleTimeExpired: function() {

		alert('Your reservation time has expired. Please go back and start your order again.');
		this.transitionTo('/');

	},

	handleClickContinue: function() {

		this.setState({isContinuing: true});
		this.transitionTo('/checkout');

	},

	componentWillUnmount: function() {

		if (!this.state.isContinuing)
		{
			// un-reserve any seats the user has if leaving...
			$.each(this.state.tickets, function(index, ticket) {

				if (typeof(ticket.seat.seatKey) != "undefined" && ticket.seat.seatKey != "")
					this.getFlux().actions.BuyTicketsActions.cancelSeatReservation(ticket.seat.seatKey, true);

			}.bind(this));
		}

	},

	render: function() {

		var tickets = this.state.tickets;
		var numSeatsChosen = 0;
		var numSeatsToChoose = 0;
		var room = this.state.room;

		if (!Object.keys(tickets).length)
			this.transitionTo('/');

		// should timer be active (has a ticket been chosen?)
		var checkoutTimer = this.state.checkoutExpireTime != null ? <CheckoutTimer onTimeExpired={this.handleTimeExpired} timeoutAt={this.state.checkoutExpireTime}/> : null;

		Object.keys(tickets).map(function(id) {
			numSeatsToChoose++;
			if (tickets[id].seat.seatKey)
				numSeatsChosen++;
		});

		var continueButton = numSeatsChosen == numSeatsToChoose ? <button className="btn btn-primary" onClick={this.handleClickContinue}>Continue</button> : null;

		var seatsMessage;
		if (numSeatsChosen < numSeatsToChoose)
			seatsMessage = <p>Selected {numSeatsChosen} out of {numSeatsToChoose} {numSeatsToChoose == 1 ? 'seat' : 'seats'}. Please select a seat for each ticket.</p>;
		else
			seatsMessage = continueButton;
		
		return (
			<div className="select-seats">
				<Header />
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h2>Choose seats for your tickets</h2>
						</div>
					</div>
					<div className="row room-select">
						<div className="col-md-12">
							<RoomsList onSelectRoom={this.handleRoomSelect}/>
							<div className="seats-message pull-right">{seatsMessage}</div>
						</div>
					</div>
					<div className="row seat-map">
						<div className="col-md-12">
							<SeatMap onSeatClick={this.handleSeatClick} room={room}/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							{checkoutTimer}
						</div>
						<div className="col-md-6 buttons-container">
							<button className="btn btn-default" onClick={this.handleClickBack}>Back</button> 
							{continueButton}
						</div>
					</div>
				</div>
				<TicketSeatList show={this.state.showTicketSeatList} room={this.state.selectedRoom} row={this.state.selectedRow} seat={this.state.selectedSeat} onHideModal={this.hideTicketSeatList} />
				<ReservationLoading show={this.state.isLoadingReservation == true} text="Reserving Seat&hellip;" />
			</div>
		);

	}

});

module.exports = SelectSeats;