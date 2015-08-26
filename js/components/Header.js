var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppLoader = require('./AppLoader');
var OrderNumberLookupModal = require('./admin/OrderNumberLookupModal');

var Header = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), Navigation],

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

		this.getFlux().actions.UserAccountActions.logout(this.context.router);

	},

	render: function() {

		var menu = [<li><a href="/#/">Buy Tickets</a></li>];
		if (this.state.isLoggedIn) {
			menu.push([
				<li className="dropdown"><a>Hello, {this.state.user.firstName}!</a></li>,
				<li><a onClick={this.handleLogoutClick}>Logout</a></li>
			]);

			// add admin menu items
			if (this.state.user.type == 'admin') {
				menu.unshift(<li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Admin <span className="caret"></span></a> <ul className="dropdown-menu"><li><a href="/#/admin/orders">All Orders</a></li><li><a href="/#/admin/checked-in-tickets">All Checked-In Tickets</a></li><li><a href="/#/admin/scan">Scan</a></li><li><a onClick={this.openLookUpOrderNumberModal}>Lookup Order #</a></li></ul></li>);
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
				<OrderNumberLookupModal />
			</div>
		);

	}

});

module.exports = Header;