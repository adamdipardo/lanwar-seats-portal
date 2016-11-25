var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TableRoom = require('./TableRoom');

var RoomsViewTable = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("RoomsStore")],

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

	componentDidMount: function() {

		this.getFlux().actions.RoomsActions.loadAllSeats();

	},

	render: function() {

        if (this.state.isLoadingAllSeats) {
			return (
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<div className="loading-circle padding"><i className="fa fa-circle-o-notch fa-spin fa-4x"></i></div>
							</div>
						</div>
					</div>
				</div>
			);
		}

        var roomViews = [];
        $.each(this.state.rooms, function(index, room) {
			roomViews.push(<TableRoom key={index} room={room} />);
		});

        return (
            <div>
                {roomViews}
            </div>
        );

    }
});

module.exports = RoomsViewTable;
