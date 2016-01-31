var React = require('react');
var Fluxxor = require('fluxxor');
var classNames = require('classnames');
var Link = require('react-router').Link;

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
			sectionClasses = [['col-xs-12', 'center-section', 'only-section']];
		else if (numSections == 3)
			sectionClasses = [['col-xs-3', 'left-section'], ['col-xs-6', 'center-section'], ['col-xs-3', 'right-section']];

		var sectionContainers = [];
		row.seats.forEach(function(element, index) {

			// get seats
			var seats = [];
			var seatLabels = [];
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
					if (this.props.isPrintable) {
						if (this.isSeatUnavailable(element.key, element))
							seats.push(<span key={index} className={classNames(classes)}><span>{element.ticket.orderId}</span></span>);
						else
							seats.push(<span key={index} className={classNames(classes)}></span>);

						seatLabels.push(<span key={index + "_label"} className="seat-label">{element.name}</span>);
					}
					else {
						var seatSpan = <span key={index} className={classNames(classes)} data-tip={seatName}></span>;
						
						if (element.ticket)
							seats.push(<Link to={"/admin/orders/" + element.ticket.orderId} key={index}>{seatSpan}</Link>);
						else
							seats.push(seatSpan);
					}
				}
				else
					seats.push(<span key={index} className={classNames(classes)} data-tip={seatName} onClick={this.handleSeatClick.bind(null, element.key, row.key, element)}></span>);
			}.bind(this));

			var rowLabel = null;
			if (this.props.isPrintable)
				rowLabel = (<span className="seat row-label"><span>{row.name}</span></span>);

			var classes = classNames(sectionClasses.shift(), 'section-row', {'admin': this.props.isAdminView, 'print': this.props.isPrintable});
			sectionContainers.push(<div key={index} className={classes}>{rowLabel}{seats}{rowLabel}<div>{seatLabels}</div></div>);
			// sectionContainers.push(<div key={index + "_labels"} className={classes}>{seatLabels}</div>)
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