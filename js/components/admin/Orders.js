var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('../Header');
var Footer = require('../Footer');
var PagingButtons = require('../PagingButtons');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Orders = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOrdersStore"), Navigation],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminOrdersStore = flux.store("AdminOrdersStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoadingOrders: AdminOrdersStore.isLoadingOrders,
			orders: AdminOrdersStore.orders,
			ordersPaging: AdminOrdersStore.ordersPaging,
			user: UserAccountStore.user,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoggedIn: UserAccountStore.isLoggedIn
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.AdminOrdersActions.getOrders(1);

	},

	handleClickNewPage: function(newPage) {

		this.getFlux().actions.AdminOrdersActions.getOrders(newPage);

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/login');

		var orderRows = [];
		if (this.state.isLoadingOrders == true) {
			orderRows.push(<tr><td colSpan="5" className="loading-row">Loading... <i className="fa fa-circle-o-notch fa-spin"></i></td></tr>)
		}
		else {		
			for (var i = 0; i < this.state.orders.length; i++) {
				var order = this.state.orders[i];
				var numCheckedIn = 0;
				for (var x = 0; x < this.state.orders[i].tickets.length; x++) {
					if (this.state.orders[i].tickets[x].isCheckedIn) numCheckedIn++;
				}
				orderRows.push(<tr key={i}><td>{order.id}</td><td>{order.user.lastName}</td><td>{order.user.firstName}</td><td>{numCheckedIn} / {order.tickets.length}</td><td><a href={"/#/admin/orders/" + order.id}>View</a></td></tr>);
			}
		}

		var paging = null;
		if (this.state.ordersPaging.from) {
			paging = (
				<div className="paging">
					<div className="pull-left">
						<p>Showing {this.state.ordersPaging.from} to {this.state.ordersPaging.to} of {this.state.ordersPaging.count}</p>
					</div>
					<div className="pull-right">
						<PagingButtons currentPage={this.state.ordersPaging.currentPage} lastPage={this.state.ordersPaging.lastPage} onClickNewPage={this.handleClickNewPage} />
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Orders</h2>

								{paging}

								<table className="table table-striped">
								<thead>
								<tr>
									<th width="10%">Order #</th>
									<th width="30%">Last</th>
									<th width="30%">First</th>
									<th width="10%">Check In</th>
									<th width="20%"></th>
								</tr>
								</thead>
								<tbody>
									{orderRows}
								</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);

	}

});

module.exports = Orders;