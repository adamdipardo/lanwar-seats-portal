var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var moment = require('moment');

var Header = require('../Header');
var Footer = require('../Footer');
var PagingButtons = require('../PagingButtons');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Orders = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOrdersStore"), Navigation],

	getInitialState: function() {

		return {
			page: 1,
			sort: 'lastName',
			sortDirection: 'asc'
		};

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
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingOrdersSummary: AdminOrdersStore.isLoadingOrdersSummary,
			summary: AdminOrdersStore.summary
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.AdminOrdersActions.getOrders(this.state.page);
		this.getFlux().actions.AdminOrdersActions.getOrdersSummary();

	},

	handleClickNewPage: function(newPage) {

		this.setState({page: newPage});
		this.getFlux().actions.AdminOrdersActions.getOrders(newPage, this.state.sort, this.state.sortDirection);

	},

	sortOrders: function(sortKey, e) {

		if (this.state.sort == sortKey) {
			var sortDir = this.state.sortDirection == 'asc' ? 'desc' : 'asc';
		}
		else {
			var sortDir = 'asc';
		}

		this.setState({sortDirection: sortDir});
		this.setState({sort: sortKey});

		this.getFlux().actions.AdminOrdersActions.getOrders(this.state.page, sortKey, sortDir);		

	},

	getPrettyDate: function(unixTime) {

		return moment(unixTime, "X").format('YYYY-MM-DD @ h:mm a');

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/login');

		var orderRows = [];
		if (this.state.isLoadingOrders == true) {
			orderRows.push(<tr><td colSpan="6" className="loading-row">Loading... <i className="fa fa-circle-o-notch fa-spin"></i></td></tr>)
		}
		else {		
			for (var i = 0; i < this.state.orders.length; i++) {
				var order = this.state.orders[i];
				var numCheckedIn = 0;
				for (var x = 0; x < this.state.orders[i].tickets.length; x++) {
					if (this.state.orders[i].tickets[x].isCheckedIn) numCheckedIn++;
				}
				orderRows.push(<tr key={i}><td>{order.id}</td><td>{order.user.lastName}</td><td>{order.user.firstName}</td><td>{this.getPrettyDate(order.created)}</td><td>{numCheckedIn} / {order.tickets.length}</td><td><a href={"/#/admin/orders/" + order.id}>View</a></td></tr>);
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

		var summary = null;
		if (!this.state.isLoadingOrdersSummary) {
			var smashOptions = [];

			if (typeof(this.state.summary.smashOptions) != "undefined") {
				for (var i = 0; i < this.state.summary.smashOptions.length; i++)
					smashOptions.push(<div className="col-md-1 options"><h2>{this.state.summary.smashOptions[i].numOrdered}</h2><h3>{this.state.summary.smashOptions[i].name}</h3></div>);
			}

			summary = (
				<div className="row orders-summary">
					<div className="col-md-2"><h2>{this.state.summary.total}</h2><h3>Tickets Sold</h3></div>
					<div className="col-md-1"><h2>{this.state.summary.byoc}<h3>BYOC</h3></h2></div>
					<div className="col-md-1"><h2>{this.state.summary.smash}</h2><h3>Smash</h3></div>
					{smashOptions}
				</div>
			);
		}

		var sortIcons = {
			orderNumber: null,
			lastName: null,
			firstName: null,
			created: null
		};
		for (var sortIcon in sortIcons) {
			if (sortIcon == this.state.sort) {
				sortIcons[sortIcon] = <i className={"fa fa-sort-" + this.state.sortDirection}></i>;
			}
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Orders</h2>

								{summary}

								{paging}

								<table className="table table-striped orders-table">
								<thead>
								<tr>
									<th width="10%"><a onClick={this.sortOrders.bind(this, 'orderNumber')}>Order # {sortIcons.orderNumber}</a></th>
									<th width="20%"><a onClick={this.sortOrders.bind(this, 'lastName')}>Last {sortIcons.lastName}</a></th>
									<th width="20%"><a onClick={this.sortOrders.bind(this, 'firstName')}>First {sortIcons.firstName}</a></th>
									<th width="20%"><a onClick={this.sortOrders.bind(this, 'created')}>Created {sortIcons.created}</a></th>
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