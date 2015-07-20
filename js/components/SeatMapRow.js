var React = require('react');
var Fluxxor = require('fluxxor');
var classNames = require('classnames');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SeatMapRow = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			tickets: BuyTicketsStore.tickets
		};

	},

	handleSeatClick: function(seat) {

		if (!this.isSeatUnavailable(seat))
			this.props.onSeatClick(this.props.row.key, seat);

	},

	render: function() {
		var row = this.props.row;		

		var numSections = row.seats.length;

		var sectionClasses;
		if (numSections == 1)
			sectionClasses = [['col-sm-12', 'center-section']];
		else if (numSections == 3)
			sectionClasses = [['col-sm-3', 'left-section'], ['col-sm-6', 'center-section'], ['col-sm-3', 'right-section']];

		var sectionContainers = [];
		row.seats.forEach(function(element, index) {

			// get seats
			var seats = [];
			element.forEach(function(element, index) {
				var seatName = "Row " + row.name + ", Seat " + element.name;
				var classes = ['seat'];
				if (this.isSeatSelectedByUser(element.key)) 
					classes.push('selected');
				else if (this.isSeatUnavailable(element.key))
				{
					classes.push('taken');
					seatName += " (taken)";
				}
				seats.push(<span key={index} className={classNames(classes)} data-tip={seatName} onClick={this.handleSeatClick.bind(null, element.key, row.key)}></span>);
			}.bind(this));

			var classes = classNames(sectionClasses.shift(), 'section-row');
			sectionContainers.push(<div key={index} className={classes}>{seats}</div>);
		}.bind(this));

		return (
			<div className="row">
				{sectionContainers}
			</div>
		);
	},

	isSeatSelectedByUser: function(seatKey) {

		var tickets = this.state.tickets;

		// console.log(tickets);

		var isSeatSelected = false;
		Object.keys(tickets).map(function(id) {
			// console.log("TEST!");
			// console.log(tickets[id].seat.seatKey);
			// console.log(seatKey);
			if (tickets[id].seat.seatKey == seatKey)
			{
				isSeatSelected = true;
				return false;
			}
		});

		return isSeatSelected;

	},

	isSeatUnavailable: function(seatKey) {

		var unavailableSeats = this.props.unavailableSeats;

		return seatKey in unavailableSeats;

	}

});

module.exports = SeatMapRow;