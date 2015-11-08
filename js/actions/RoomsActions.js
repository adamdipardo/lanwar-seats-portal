var LanwarConstants = require('../constants/LanwarConstants');

var RoomsActions = {
	loadRooms: function() {

		this.dispatch(LanwarConstants.LOAD_ROOMS);

		$.ajax({
			url: '/api/events/' + LanwarConstants.EVENT_ID + '/rooms/read',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_ROOMS_SUCCESS, {rooms: result});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_ROOMS_FAILURE, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});

	},

	loadSeats: function(roomKey, roomId, isAdminView) {

		this.dispatch(LanwarConstants.LOAD_SEATS, {roomKey: roomKey, roomId: roomId});

		$.ajax({
			url: '/api/rooms/' + roomId + '/seats/read',
			type: 'post',
			data: {adminView: isAdminView === true},
			success: function(result) {
				this.dispatch(LanwarConstants.LOAD_SEATS_SUCCESS, {roomKey: roomKey, roomId: roomId, rows: result});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOAD_SEATS_FAILURE, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});

	}
};

module.exports = RoomsActions;