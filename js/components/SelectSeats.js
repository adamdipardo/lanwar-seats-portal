var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
var moment = require('moment');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var RoomsList = require('./RoomsList');
var SeatMap = require('./SeatMap');
var TicketSeatList = require('./TicketSeatList');
var ReservationLoading = require('./ReservationLoading');
var CheckoutTimer = require('./CheckoutTimer');
var Header = require('./Header');
var Footer = require('./Footer');

var SelectSeats = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("OrderStore"), History],

	getInitialState: function() {
		return {
			showTicketSeatList: false,
			room: null,
			isContinuing: false
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var OrderStore = flux.store("OrderStore").getState();

		return {
			order: OrderStore.order,
			isLoadingReservation: OrderStore.isLoadingReservation,
			reservationError: OrderStore.reservationError,
			checkoutExpireTime: OrderStore.checkoutExpireTime,
			isLoadingBooking: OrderStore.isLoadingBooking,
			reservationSessionId: OrderStore.reserveSessionId
		};

	},

	handleClickBack: function() {

		var response = confirm("Are you sure you want to go back? Any new seats that you have reserved in this session will be lost. (Previously reserved seats will be kept.)");

		if (response == true) {
			if (this.props.params.orderId)
				this.history.pushState(null, '/admin/orders/' + this.props.params.orderId);
			else
				this.history.pushState(null, '/order/' + this.props.params.orderHash);
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

		alert('Your reservation time has expired. Please start over if you\'d like to reserve new seats.');

		if (this.props.params.orderId)
			this.history.pushState(null, '/admin/orders/' + this.props.params.orderId);
		else
			this.history.pushState(null, '/order/' + this.props.params.orderHash);
	},

	handleClickContinue: function() {

		this.setState({isContinuing: true});
		
		this.getFlux().actions.OrderActions.bookSeats(this.props.params.orderHash, this.props.params.orderId, this.state.order.tickets, this.state.reservationSessionId);

	},

	componentWillUnmount: function() {

		if (!this.state.isContinuing)
		{
			// un-reserve any seats the user has if leaving...
			$.each(this.state.order.tickets, function(index, ticket) {

				if (typeof(ticket.seat.seatKey) != "undefined" && ticket.seat.seatKey != "")
					this.getFlux().actions.OrderActions.cancelSeatReservation(ticket.seat.seatKey, true);

			}.bind(this));
		}

	},

	render: function() {

		var tickets = this.state.order.tickets;
		var numSeatsChosen = 0;
		var numSeatsToChoose = 0;
		var numNewSeats = 0;
		var room = this.state.room;

		if (!this.props.params.orderHash && !this.props.params.orderId) {
			this.history.pushState(null, '/');
			return (<div></div>);
		}
		else if (!this.state.order.tickets || this.state.order.tickets.length == 0) {
			if (this.props.params.orderHash)
				this.history.pushState(null, '/order/' + this.props.params.orderHash);
			else
				this.history.pushState(null, '/admin/orders/' + this.props.params.orderId);
			return (<div></div>);
		}

		// should timer be active (has a ticket been chosen?)
		var checkoutTimer = this.state.checkoutExpireTime != null ? <CheckoutTimer onTimeExpired={this.handleTimeExpired} timeoutAt={this.state.checkoutExpireTime}/> : null;

		$.each(tickets, function(index, ticket) {

			// skip tickets that cannot have seats
			if (!ticket.canBookSeat)
				return true;

			numSeatsToChoose++;
			if (tickets[index].seat.name || tickets[index].seat.seatKey)
				numSeatsChosen++;
			if (tickets[index].seat.seatKey && tickets[index].seat.seatKey != tickets[index].seat.id)
				numNewSeats++;
		});

		var continueButton = numNewSeats > 0 ? <button className="btn btn-primary" onClick={this.handleClickContinue}>Save</button> : null;

		var newSeatsMessage;
		if (numNewSeats)
			newSeatsMessage = <span>({numNewSeats} new {numNewSeats > 1 ? 'seats' : 'seat'})</span>;

		var loadingMessage;
		if (this.state.isLoadingReservation == true)
			loadingMessage = 'Reserving Seat…';
		else if (this.state.isLoadingBooking == true)
			loadingMessage = 'Booking Seats…';
		
		return (
			<div className="select-seats">
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Choose seats for your tickets</h2>
							</div>
						</div>
						<div className="row room-select">
							<div className="col-md-12">
								<RoomsList onSelectRoom={this.handleRoomSelect}/>
								<div className="seats-message pull-right"><p>Selected {numSeatsChosen} out of {numSeatsToChoose} {numSeatsToChoose == 1 ? 'seat' : 'seats'}. {newSeatsMessage} {continueButton}</p></div>
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
								<button className="btn btn-default" onClick={this.handleClickBack}>Cancel</button> 
								{continueButton}
							</div>
						</div>
					</div>
				</div>
				<Footer />
				<TicketSeatList show={this.state.showTicketSeatList} room={this.state.selectedRoom} row={this.state.selectedRow} seat={this.state.selectedSeat} onHideModal={this.hideTicketSeatList} />
				<ReservationLoading show={this.state.isLoadingReservation == true || this.state.isLoadingBooking == true} text={loadingMessage} />
			</div>
		);

	}

});

module.exports = SelectSeats;