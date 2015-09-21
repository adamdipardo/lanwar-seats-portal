var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Footer = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), Navigation],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn
		};

	},

	handleLogoutClick: function(e) {

		e.preventDefault();

		this.getFlux().actions.UserAccountActions.logout(this.context.router);

	},

	render: function() {

		var loginLogout;
		if (this.state.isLoggedIn)
			loginLogout = <a onClick={this.handleLogoutClick}>Logout</a>;
		else
			loginLogout = <a href="/#/login">Admin Login</a>;

		return (			
			<footer className="container-fluid">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<a href="http://lanwarx.ca">LANWARX.ca</a>
							{loginLogout}
						</div>
					</div>
				</div>
			</footer>
		);

	}

});

module.exports = Footer;