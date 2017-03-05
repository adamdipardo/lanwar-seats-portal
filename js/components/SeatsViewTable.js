var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SeatsViewTable = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("SimpleOrdersStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var SimpleOrdersStore = flux.store("SimpleOrdersStore").getState();

		return {
			orders: SimpleOrdersStore.orders,
			isLoadingOrders: SimpleOrdersStore.isLoadingOrders
		}

	},

	componentDidMount: function() {

		this.getFlux().actions.SimpleOrdersActions.loadOrders();

	},

	render: function() {

        if (this.state.isLoadingOrders) {
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

        var orderRows = [];
        $.each(this.state.orders, function(index, order) {

            for(var i = 0; i < order.tickets.length; i++) {

                var seat = "";
                if (order.tickets[i].seat != false) {
                    seat = order.tickets[i].seat.name;
                }
                else if (order.tickets[i].type == "BYOC") {
                    seat = "Not Chosen";
                }
                else {
                    seat = "Not Available for this ticket";
                }

    			orderRows.push(<tr>
                        <td>{order.eventBriteOrderId}</td>
                        <td>{order.lastName}</td>
                        <td>{order.firstName}</td>
                        <td>{order.email}</td>
                        <td>{seat}</td>
                    </tr>);
            }
		});

        return (
            <div className="seats-table-container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>EventBrite Order</th>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Email</th>
                            <th>Seat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderRows}
                    </tbody>
                </table>
            </div>
        );

    }
});

module.exports = SeatsViewTable;
