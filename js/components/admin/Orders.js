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

		// this.getFlux().actions.AdminOrdersActions.getOrders(this.state.page);
		this.getOrders();
		this.getFlux().actions.AdminOrdersActions.getOrdersSummary();

	},

	handleClickNewPage: function(newPage) {

		this.setState({page: newPage});
		// this.getFlux().actions.AdminOrdersActions.getOrders(newPage, this.state.sort, this.state.sortDirection);
		this.getOrders(newPage);

	},

	sortOrders: function(sortKey, e) {

		if (this.state.sort == sortKey) {
			var sortDir = this.state.sortDirection == 'asc' ? 'desc' : 'asc';
		}
		else {
			var sortDir = 'asc';
		}

		this.setState({sortDirection: sortDir}, function() {
			this.setState({sort: sortKey}, function() {
				this.getOrders(1);
			});	
		});
		

		// this.getFlux().actions.AdminOrdersActions.getOrders(this.state.page, sortKey, sortDir);		

	},

	getPrettyDate: function(unixTime) {

		return moment(unixTime, "X").format('YYYY-MM-DD @ h:mm a');

	},

	handleFilterChange: function(e) {

		var stateObject = function() {
      		returnObj = {};
      		if (e.target.type == "checkbox")
      			returnObj[this.target.name] = this.target.checked;
      		else
      			returnObj[this.target.name] = this.target.value;
        	return returnObj;
    	}.bind(e)();

    	this.setState(stateObject);

	},

	handleFilterSubmit: function(e) {

		e.preventDefault();

		/*var ticketTypes = [];
		if (this.state.byoc)
			ticketTypes.push(1);
		if (this.state.smash4)
			ticketTypes.push(11);
		if (this.state.melee)
			ticketTypes.push(31);
		if (this.state.spectator)
			ticketTypes.push(21);

		var startDate;
		var endDate;
		if (this.state.dateRange == "today") {
			startDate = moment().format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");
		}
		else if (this.state.dateRange == "yesterday") {
			startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
			endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
		}
		else if (this.state.dateRange == "last7") {
			startDate = moment().subtract(7, 'days').format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");	
		}
		else if (this.state.dateRange == "custom") {
			startDate = this.state.startDate;
			endDate = this.state.endDate;
		}

		var filters = {
			paymentMethod: this.state.paymentMethod,
			ticketTypes: ticketTypes,
			startDate: startDate,
			endDate: endDate,
			name: this.state.name
		};

		this.getFlux().actions.AdminOrdersActions.getOrders(1, this.state.sort, this.state.sortDirection, filters);*/

		this.getOrders();

	},

	handleFilterToggle: function(show, e) {

		this.setState({showFilter: show});

		if (show == false)
			this.handleFilterClear();

	},

	handleFilterClear: function(e) {

		this.setState({
			paymentMethod: "",
			byoc: false,
			smash4: false,
			melee: false,
			spectator: false,
			startDate: null,
			endDate: null,
			dateRange: "",
			name: ""
		}, function() {
			this.getOrders(1);
		});

	},

	getOrders: function(page) {

		if (typeof(page) == "undefined")
			page = this.state.page;

		var ticketTypes = [];
		if (this.state.byoc)
			ticketTypes.push(1);
		if (this.state.smash4)
			ticketTypes.push(11);
		if (this.state.melee)
			ticketTypes.push(31);
		if (this.state.spectator)
			ticketTypes.push(21);

		var startDate;
		var endDate;
		if (this.state.dateRange == "today") {
			startDate = moment().format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");
		}
		else if (this.state.dateRange == "yesterday") {
			startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
			endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
		}
		else if (this.state.dateRange == "last7") {
			startDate = moment().subtract(7, 'days').format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");	
		}
		else if (this.state.dateRange == "customRange") {
			startDate = this.state.startDate;
			endDate = this.state.endDate;
		}

		var filters = {
			paymentMethod: this.state.paymentMethod,
			ticketTypes: ticketTypes,
			startDate: startDate,
			endDate: endDate,
			name: this.state.name
		};
		
		this.getFlux().actions.AdminOrdersActions.getOrders(page, this.state.sort, this.state.sortDirection, filters);

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/login', {}, {expired: true, return: this.context.router.getCurrentPathname()});

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
				<div className="row paging">
					<div className="col-md-6">
						<p className="orders-showing-count">Showing {this.state.ordersPaging.from} to {this.state.ordersPaging.to} of {this.state.ordersPaging.count}</p>
					</div>
					<div className="col-md-6" style={{textAlign: "right"}}>
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
					<div className="col-md-1"><h2>{this.state.summary.spectator}<h3>Spectator</h3></h2></div>
					<div className="col-md-4">
						<a className="btn btn-primary" href="/api/orders/csv/read" target="_blank">Download CSV</a>
					</div>
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

		var rangeFields;
		if (this.state.dateRange == "customRange") {
			rangeFields = (
				<div className="form-group">
					<div className="row">
						<div className="col-sm-6">
							<label htmlFor="startDate">Start</label>
							<input type="date" id="startDate" name="startDate" value={this.state.startDate} onChange={this.handleFilterChange} placeholder="Start" className="form-control"/>
						</div>
						<div className="col-sm-6">
						<label htmlFor="endDate">End</label>
							<input type="date" id="endDate" name="endDate" value={this.state.endDate} onChange={this.handleFilterChange} placeholder="End" className="form-control"/>
						</div>
					</div>
				</div>
			);
		}

		var filter;
		if (this.state.showFilter) {
		 	filter = (
				<form onSubmit={this.handleFilterSubmit}>
				<div className="row">
					<div className="col-md-12 filter-toggle">
						<a onClick={this.handleFilterToggle.bind(this, false)}><i className="fa fa-angle-down"></i> Hide Filters</a>
					</div>
				</div>
				<div className="row filter">
					<div className="col-md-2">
						<h4>Payment Method</h4>
						<div className="form-group">
							<div className="radio">
								<label>
									<input type="radio" value="" name="paymentMethod" checked={this.state.paymentMethod == ""} onChange={this.handleFilterChange} />
									All
								</label>
							</div>
							<div className="radio">
								<label>
									<input type="radio" value="online" name="paymentMethod" checked={this.state.paymentMethod == "online"} onChange={this.handleFilterChange} />
									Online
								</label>
							</div>
							<div className="radio">
								<label>
									<input type="radio" value="cash" name="paymentMethod" checked={this.state.paymentMethod == "cash"} onChange={this.handleFilterChange} />
									Cash
								</label>
							</div>
						</div>
					</div>
					<div className="col-md-2">
						<h4>Ticket Types</h4>
						<div className="form-group">
							<div className="checkbox">
								<label>
									<input type="checkbox" name="byoc" checked={this.state.byoc} onChange={this.handleFilterChange} />
									BYOC
								</label>
							</div>
							<div className="checkbox">
								<label>
									<input type="checkbox" name="smash4" checked={this.state.smash4} onChange={this.handleFilterChange} />
									Smash 4
								</label>
							</div>
							<div className="checkbox">
								<label>
									<input type="checkbox" name="melee" checked={this.state.melee} onChange={this.handleFilterChange} />
									Melee
								</label>
							</div>
							<div className="checkbox">
								<label>
									<input type="checkbox" name="spectator" checked={this.state.spectator} onChange={this.handleFilterChange} />
									Spectator
								</label>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<h4>Date</h4>
						<div className="form-group">
							<select name="dateRange" value={this.state.dateRange} onChange={this.handleFilterChange} className="form-control">
								<option value="">All</option>
								<option value="today">Today</option>
								<option value="yesterday">Yesterday</option>
								<option value="last7">Last 7 Days</option>
								<option value="customRange">Custom Range</option>
							</select>
						</div>
						{rangeFields}
					</div>
					<div className="col-md-4">
						<h4>Name Contains</h4>
						<div className="form-group">
							<input type="text" name="name" value={this.state.name} onChange={this.handleFilterChange} className="form-control" />
						</div>
					</div>
					<div className="col-md-12 buttons-container">
						<button type="submit" className="btn btn-primary">Apply Filters</button>
						<button type="button" onClick={this.handleFilterClear} className="btn btn-default">Clear All</button>
					</div>
				</div>
				</form>
			);
		}
		else {
			filter = (
				<div className="row">
					<div className="col-md-12 filter-toggle">
						<a onClick={this.handleFilterToggle.bind(this, true)}><i className="fa fa-angle-up"></i> Show Filters</a>
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

								{summary}

								{filter}

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

								{paging}
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