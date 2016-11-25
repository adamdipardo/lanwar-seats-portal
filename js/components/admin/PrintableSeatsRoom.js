var React = require('react');
var Fluxxor = require('fluxxor');

var SeatMapRow = require('../SeatMapRow');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var PrintableSeatsRoom = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("RoomsStore", "SeatAvailabilityStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var RoomsStore = flux.store("RoomsStore").getState();
		var SeatAvailabilityStore = flux.store("SeatAvailabilityStore").getState();

		return {
			rooms: RoomsStore.rooms,
			isLoadingAllSeats: RoomsStore.isLoadingAllSeats
		}

	},

	render: function() {

		var seatingPlan = this.generateSeatingPlanArray(this.props.room.rows);
		var seatingPlanRows = [];
		seatingPlan.reverse().forEach(function(element, index) {
			seatingPlanRows.push(<SeatMapRow key={index} row={element} isAdminView={true} isPrintable={true}/>);
		}.bind(this));

		return (
			<div className="seats-room">
				<h2>{this.props.room.name}</h2>
				<p>Seats that are taken have an Order Number.</p>
				{seatingPlanRows}
				<div className="front">Front</div>
			</div>
		);

	},

	generateSeatingPlanArray: function(rows) {
		var seatingPlan = [];
		var numSections = 0;

		$.each(rows, function(index, row) {
			seatingPlan.push({key: index, id: row.id, name: row.name, seats: []});
			var seatingPlanRow = seatingPlan[seatingPlan.length - 1].seats;
			$.each(row.seats, function(index, seat) {
				if (numSections < seat.section) numSections = seat.section;
				var sectionNum = seat.section - 1;
				for (var i = 0; i <= sectionNum; i++)
					if (typeof seatingPlanRow[i] === "undefined") seatingPlanRow[i] = [];

				var data = {key: index, id: seat.id, name: seat.name};

				data.isBooked = seat.isBooked;
				data.ticket = seat.ticket;

				seatingPlanRow[sectionNum].push(data);
			}.bind(this));
		}.bind(this));

		// add any missing sections
		seatingPlan.forEach(function(element, index) {
			while (element.seats.length < numSections)
				element.seats.push([]);
		});

		return seatingPlan;
	}

});

module.exports = PrintableSeatsRoom;
