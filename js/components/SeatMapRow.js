var React = require('react');
var Fluxxor = require('fluxxor');
var classNames = require('classnames');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SeatMapRow = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("OrderStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var OrderStore = flux.store("OrderStore").getState();

		return {
			order: OrderStore.order
		};

	},

	handleSeatClick: function(seat, row, seatElement) {
		
		if (!this.isSeatUnavailable(seat))
			this.props.onSeatClick(this.props.row.key, seat);

	},

	render: function() {
		var row = this.props.row;		

		var numSections = row.seats.length;

		var sectionClasses;
		if (numSections == 1)
			sectionClasses = [['col-xs-12', 'center-section']];
		else if (numSections == 3)
			sectionClasses = [['col-xs-3', 'left-section'], ['col-xs-6', 'center-section'], ['col-xs-3', 'right-section']];

		var sectionContainers = [];
		row.seats.forEach(function(element, index) {

			// get seats
			var seats = [];
			element.forEach(function(element, index) {
				var seatName = "Row " + row.name + ", Seat " + element.name;
				var classes = ['seat'];
				if (this.isSeatSelectedByUser(element.key)) 
					classes.push('selected');
				else if (this.isSeatUnavailable(element.key, element))
				{
					classes.push('taken');

					if (this.props.isAdminView)
						seatName += " (Ticket #" + element.ticket.id + ", " + element.ticket.firstName + " " + element.ticket.lastName + ")";
					else
						seatName += " (taken)";
				}

				if (this.props.isAdminView) {
					var seatSpan = <span key={index} className={classNames(classes)} data-tip={seatName}></span>;
					
					if (element.ticket)
						seats.push(<a href={"/#/admin/orders/" + element.ticket.orderId}>{seatSpan}</a>);
					else
						seats.push(seatSpan);
				}
				else
					seats.push(<span key={index} className={classNames(classes)} data-tip={seatName} onClick={this.handleSeatClick.bind(null, element.key, row.key, element)}></span>);
			}.bind(this));

			var classes = classNames(sectionClasses.shift(), 'section-row', {'admin': this.props.isAdminView});
			sectionContainers.push(<div key={index} className={classes}>{seats}</div>);
		}.bind(this));

		return (
			<div className="row seat-row">
				{sectionContainers}
			</div>
		);
	},

	isSeatSelectedByUser: function(seatKey) {

		if (this.props.isAdminView)
			return false;

		var tickets = this.state.order.tickets;

		// console.log(tickets);

		var isSeatSelected = false;
		$.each(tickets, function(id, ticket) {
			if (ticket.seat.seatKey == seatKey || ticket.seat.id == seatKey)
			{
				isSeatSelected = true;
				return false;
			}
		});

		return isSeatSelected;

	},

	isSeatUnavailable: function(seatKey, seat) {

		if (this.props.isAdminView) {
			return seat.isBooked;
		}
		else {
			var unavailableSeats = this.props.unavailableSeats;

			return seatKey in unavailableSeats;
		}

	}

});

module.exports = SeatMapRow;