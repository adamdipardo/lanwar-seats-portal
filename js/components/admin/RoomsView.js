var React = require('react');
var Fluxxor = require('fluxxor');
var Link = require('react-router').Link;

var RoomsList = require('../RoomsList');
var SeatMap = require('../SeatMap');
var Header = require('../Header');
var Footer = require('../Footer');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var RoomsView = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("RoomsStore", "UserAccountStore")],

	getInitialState: function() {
		return {
			room: null
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var RoomsStore = flux.store("RoomsStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			user: UserAccountStore.user,
			rooms: RoomsStore.rooms,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSeats: RoomsStore.isLoadingSeats
		};

	},

	handleRoomSelect: function(roomKey) {

		this.setState({room: roomKey});

	},

	handleRefreshClick: function() {

		if (!this.state.room)
			return;

		this.getFlux().actions.RoomsActions.loadSeats(this.state.room, this.state.rooms[this.state.room].id, true);
		this.setState({clickedRefresh: true});

	},

	render: function() {

		var room = this.state.room;

		var refreshButton;
		if (this.state.isLoadingSeats && this.state.clickedRefresh) {
			refreshButton = <a onClick={this.handleRefreshClick} style={{float: "right"}}><i className="fa fa-refresh fa-spin"></i></a>;
		}
		else {
			refreshButton = <a onClick={this.handleRefreshClick} style={{float: "right"}}><i className="fa fa-refresh"></i></a>;
		}
		
		return (
			<div className="select-seats">
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Rooms View {refreshButton}</h2>								
							</div>
						</div>
						<div className="row room-select">
							<div className="col-md-12">
								<RoomsList onSelectRoom={this.handleRoomSelect} isAdminView={true}/>
								<Link to="/admin/rooms/print" target="_blank" className="btn btn-primary pull-right">Printable View</Link>
								<div className="seats-message pull-right"><p>Click a taken seat to view the Order Details for that ticket.</p></div>
							</div>
						</div>
						<div className="row seat-map">
							<div className="col-md-12">
								<SeatMap onSeatClick={this.handleSeatClick} room={room} isAdminView={true}/>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);

	}

});

module.exports = RoomsView;