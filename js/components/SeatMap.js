var React = require('react');
var Fluxxor = require('fluxxor');
var ReactTooltip = require("react-tooltip");
var socket = require('socket.io-client');
var io;

var SeatMapRow = require('./SeatMapRow');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SeatMap = React.createClass({
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
			unavailableSeats: SeatAvailabilityStore.seats,
			isLoadingSeats: RoomsStore.isLoadingSeats
		}

	},

	componentDidMount: function() {

		this.getFlux().actions.SeatAvailabilityActions.loadSeatStatuses();

		io = socket('http://127.0.0.1:3000');

		io.on('seat changed', function(data) {
			this.getFlux().actions.SeatAvailabilityActions.seatStatusChanged(data.id, data.status);
		}.bind(this));

	},

	componentWillUnmount: function() {

		io.disconnect();

	},

	handleSeatClick: function(row, seat) {

		this.props.onSeatClick(this.props.room, row, seat);

	},

	render: function() {

		// show placeholder until a room is selected
		if (this.props.room == null || !this.state.rooms[this.props.room].rows || !Object.keys(this.state.rooms[this.props.room].rows).length)
		{
			if (this.state.isLoadingSeats)
			{
				return (
					<div>
						<div className="loading-circle"><i className="fa fa-circle-o-notch fa-spin fa-4x"></i></div>
					</div>
				);
			}
			else
			{
				return (
					<div>
						<p style={{textAlign: 'center'}}>Please select a room to view available seats.</p>
					</div>
				);
			}
		}

		// get selected room's rows
		var rows = this.getSelectedRoomRows();

		// get seating plan array
		var seatingPlan = this.generateSeatingPlanArray(rows);

		var seatingPlanRows = [];
		seatingPlan.reverse().forEach(function(element, index) {
			seatingPlanRows.push(<SeatMapRow key={index} row={element} onSeatClick={this.handleSeatClick} unavailableSeats={this.state.unavailableSeats}/>);
		}.bind(this));

		return (
			<div>
				{seatingPlanRows}
				<div className="front">Front</div>
				<ReactTooltip />
			</div>
		);
	},

	getSelectedRoomRows: function() {
		
		var rooms = this.state.rooms;
		var rows = rooms[this.props.room].rows;

		return rows;
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

				seatingPlanRow[sectionNum].push({key: index, id: seat.id, name: seat.name});
			});
		});

		// add any missing sections
		seatingPlan.forEach(function(element, index) {
			while (element.seats.length < numSections)
				element.seats.push([]);
		});

		return seatingPlan;
	}

});

module.exports = SeatMap;