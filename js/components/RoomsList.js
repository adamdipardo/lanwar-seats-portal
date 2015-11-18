var React = require('react');
var Fluxxor = require('fluxxor');
var Select = require('react-select');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var RoomsList = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("RoomsStore")],

	getInitialState: function() {
		return {
			selectedRoom: null
		};
	},

	getStateFromFlux: function() {

		
		var flux = this.getFlux();

		var RoomsStore = flux.store("RoomsStore").getState();

		return {
			rooms: RoomsStore.rooms,
			isLoadingRooms: RoomsStore.isLoadingRooms
		};

	},

	componentDidMount: function() {

		if ($.isEmptyObject(this.state.rooms))
			this.getFlux().actions.RoomsActions.loadRooms();

	},

	handleClick: function(roomKey) {

		if (roomKey != null)
		{
			// get ID of room
			var rooms = this.getFlux().store("RoomsStore").getState().rooms;

			this.getFlux().actions.RoomsActions.loadSeats(roomKey, rooms[roomKey].id, this.props.isAdminView);
		}

		this.props.onSelectRoom(roomKey);

		this.setState({selectedRoom: roomKey});

	},

	render: function() {

		var rooms = this.state.rooms;

		// quit if no rooms yet
		var hasRooms = false;
		$.each(rooms, function(index, room) {
			hasRooms = true;
			return false;
		});
		if (!hasRooms)
			return <div className="room-list pull-left"><span className="seat-select-title loading">Loading Rooms...</span></div>;

		var selectedRoom = this.state.selectedRoom;

		var options = [];
		var disabledRooms = ["61","71","81"];
		Object.keys(rooms).map(function(id) {
			if (this.props.isAdminView || disabledRooms.indexOf(id) == -1)
				options.push({value: String(id), label: rooms[id].name + "   (" + rooms[id].seats.taken + "/" + rooms[id].seats.total + ")"});
		}.bind(this));

		return (
			<div className="room-list pull-left">
				<span className="seat-select-title">Room: </span>
				<Select placeholder="Select a room" searchable={false} clearable={false} value={selectedRoom} options={options} onChange={this.handleClick} />
			</div>
		);

	}

});

module.exports = RoomsList;