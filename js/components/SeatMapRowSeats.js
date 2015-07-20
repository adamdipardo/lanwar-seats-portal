var React = require('react');
var Fluxxor = require('fluxxor');

var SeatMapRowSeats = React.createClass({

	render: function() {

		var seats = this.props.seats;

		var seatsList = [];
		seats.forEach(function(element, index) {
			seatsList.push(<span key={index}>{element.name}</span>);
		});

		return (
			<div>
				{seatsList}
			</div>
		);

	}

});

module.exports = SeatMapRowSeats;