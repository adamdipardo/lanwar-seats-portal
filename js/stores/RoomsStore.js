var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');
var _ = require('underscore');

var RoomsStore = Fluxxor.createStore({
	initialize: function() {
		this.rooms = {};
		this.isLoadingRooms = false;
		this.getRoomsError = null;
		// this.selectedRoom = null;
		this.isLoadingSeats = false;
		this.getSeatsError = null;

		this.bindActions(
			LanwarConstants.LOAD_ROOMS, this.onLoadRooms,
			LanwarConstants.LOAD_ROOMS_SUCCESS, this.onLoadRoomsSuccess,
			LanwarConstants.LOAD_ROOMS_FAILURE, this.onLoadRoomsFailure,
			LanwarConstants.LOAD_SEATS, this.onLoadSeats,
			LanwarConstants.LOAD_SEATS_SUCCESS, this.onLoadSeatsSuccess,
			LanwarConstants.LOAD_SEATS_FAILURE, this.onLoadSeatsFailure
		);
	},

	onLoadRooms: function(payload) {
		this.isLoadingRooms = true;
		this.getRoomsError = null;
		this.emit("change");
	},

	onLoadRoomsSuccess: function(payload) {
		this.isLoadingRooms = false;
		this.rooms = payload.rooms.reduce(function(acc, room){
			var clientId = room.id;
			acc[clientId] = {id: room.id, name: room.name, seats: {total: room.seats.total, taken: room.seats.taken}};
			return acc;
		}, {});
		this.emit("change");
	},

	onLoadRoomsFailure: function(payload) {
		this.isLoadingRooms = false;
		this.getRoomsError = payload.error;
		this.emit("change");
	},

	onLoadSeats: function(payload) {
		this.isLoadingSeats = true;
		this.getSeatsError = null;

		// empty existing rows if found...
		for (var room in this.rooms)
		{
			if (this.rooms[room].id == payload.roomId)
			{
				this.rooms[room].rows = {};
			}
		}

		this.emit("change");
	},

	onLoadSeatsSuccess: function(payload) {
		this.isLoadingSeats = false;
		// this.selectedRoom = payload.roomKey;
		for (var room in this.rooms)
		{
			if (this.rooms[room].id == payload.roomId)
			{
				this.rooms[room].rows = payload.rows.reduce(function(acc, row) {
					var seats = row.seats.reduce(function(acc, seat) {
						var clientId = seat.id;
						acc[clientId] = {id: seat.id, name: seat.name, section: seat.section, isBooked: seat.isBooked};
						return acc;
					}, {});
					var clientId = row.id;
					acc[clientId] = {id: row.id, name: row.name, seats: seats};
					return acc;
				}, {});
			}
		}
		this.emit("change");
	},

	onLoadSeatsFailure: function(payload) {
		this.isLoadingSeats = false;
		this.getSeatsError = payload.error;
		this.emit("change");
	},

	getState: function() {
		return {
			isLoadingRooms: this.isLoadingRooms,
			getRoomsError: this.getRoomsError,
			rooms: this.rooms,
			selectedRoom: this.selectedRoom,
			isLoadingSeats: this.isLoadingSeats
		};
	}
});

module.exports = RoomsStore;