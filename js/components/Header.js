var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
var Link = require('react-router').Link;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppLoader = require('./AppLoader');
var OrderNumberLookupModal = require('./admin/OrderNumberLookupModal');
var SessionTimedOutModal = require('./SessionTimedOutModal');

var Header = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), History],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn,
			user: UserAccountStore.user
		};

	},

	openLookUpOrderNumberModal: function() {

		this.getFlux().actions.AdminOrdersActions.openLookupOrderNumberModal();
		setTimeout(function(){$('#order-number').focus();}, 100);

	},

	handleLogoutClick: function(e) {

		e.preventDefault();

		this.getFlux().actions.UserAccountActions.logout();

	},

	render: function() {

		var menu = [];
		if (this.state.isLoggedIn) {
			menu.push([
				<li className="dropdown" key={1}><Link to="/profile">Profile</Link></li>,
				<li key={2}><a onClick={this.handleLogoutClick}>Logout</a></li>
			]);

			// add admin menu items
			if (this.state.user.type == 'admin') {
				menu.unshift(<li className="dropdown" key={3}><a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Admin <span className="caret"></span></a> <ul className="dropdown-menu"><li><Link to="/admin/orders">All Orders</Link></li><li><Link to="/admin/checked-in-tickets">All Checked-In Tickets</Link></li><li><Link to="/admin/scan">Scan</Link></li><li><a onClick={this.openLookUpOrderNumberModal}>Lookup Order #</a></li><li><Link to="/admin/rooms-view">Rooms View</Link></li></ul></li>);
				menu.unshift(<li key={0}><Link to="/">Buy Tickets</Link></li>);
			}
		}

		return (
			<div>
				<AppLoader />
				<nav className="navbar navbar-default">
					<header className="container-fluid">
						<div className="container">
							<div className="navbar-header">
								<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
									<span className="sr-only">Toggle navigation</span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
								<a className="navbar-brand"><strong>LANWAR</strong> X</a>
							</div>
							<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
								<ul className="nav navbar-nav navbar-right">
									{menu}
								</ul>
							</div>
						</div>
					</header>
				</nav>
				<SessionTimedOutModal />
				<OrderNumberLookupModal />
			</div>
		);

	}

});

module.exports = Header;