var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppLoader = require('./AppLoader');

var Header = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), Navigation],

	getInitialState: function() {

		return {
			email: "",
			emailError: false,
			password: "",
			passwordError: false
		}

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoadingLogin: UserAccountStore.isLoadingLogin,
			isLoggedIn: UserAccountStore.isLoggedIn,
			user: UserAccountStore.user
		};

	},

	toggleLogin: function() {

		$('div.container-fluid.body').toggleClass('login-open');

		if ($('div.container-fluid.body').hasClass('login-open'))
		{
			$('div.container-fluid.body').css({top: $('div.login-slideout').outerHeight() + 'px'});
			$('#loginEmail').focus();
		}
		else
			$('div.container-fluid.body').css({top: 0});

	},

	attemptLogin: function(e) {

		e.preventDefault();

		if (!this.state.email || !this.state.email.trim())
			this.setState({emailError: true});

		if (!this.state.password || !this.state.password.trim())
			this.setState({passwordError: true});

		if (!this.state.emailError && !this.state.passwordError)
			this.getFlux().actions.UserAccountActions.login(this.state.email, this.state.password, this.context.router);

	},

	handleLogoutClick: function(e) {

		e.preventDefault();

		this.getFlux().actions.UserAccountActions.logout(this.context.router);

	},

	updateFormState: function(e) {

		if (e.target.name == 'email')
			this.setState({email: e.target.value});
		else if (e.target.name == 'password')
			this.setState({password: e.target.value});

	},

	render: function() {

		

		if (this.state.isLoadingLogin) {
			var loginButton = <button type="submit" className="btn btn-primary" disabled="disabled">Logging In... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		}
		else {
			var loginButton = <span><button type="submit" className="btn btn-primary">Login</button> or <a href="/#/register">create an account</a>.</span>;
		}

		var loginSlider = <div className="container-fluid login-slideout">
				<div className="container">
					<div className="row">
						<div className="col-md-9"></div>
						<div className="col-md-3">
							<form className="form" onSubmit={this.attemptLogin}>
							<div className="form-group">
								<label htmlFor="loginEmail" className="sr-only">Email</label>
								<input type="email" name="email" id="loginEmail" placeholder="Email Address" className="form-control" value={this.state.isLoggedIn ? null : this.state.email} onChange={this.updateFormState} required/>
							</div>
							<div className="form-group">
								<label htmlFor="loginPassword" className="sr-only">Password</label>
								<input type="password" name="password" id="loginPassword" placeholder="Password" className="form-control" value={this.state.isLoggedIn ? null : this.state.password} onChange={this.updateFormState} required/>
							</div>
							<div className="form-group">
								{loginButton}
							</div>
							</form>
						</div>
					</div>
				</div>
			</div>

		var menu = [];
		if (this.state.isLoggedIn) {
			menu.push([
				<li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Hello, {this.state.user.firstName}! <span className="caret"></span></a> <ul className="dropdown-menu"><li><a href="/#/profile">My Profile</a></li></ul></li>,
				<li><a onClick={this.handleLogoutClick}>Logout</a></li>
			]);

			// add admin menu items
			if (this.state.user.type == 'admin') {
				menu.unshift(<li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Admin <span className="caret"></span></a> <ul className="dropdown-menu"><li><a href="/#/admin/orders">All Orders</a></li><li><a href="/#/admin/scan">Scan</a></li></ul></li>);
			}
		}
		else
			menu.push(<li><a onClick={this.toggleLogin}>Login</a></li>);

		return (
			<div>
				<AppLoader />
				<header className="container-fluid">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h1 className="logo"><strong>LANWAR</strong> X</h1>

								<ul className="menu">
									{menu}
								</ul>
							</div>
						</div>
					</div>
				</header>
				{loginSlider}
			</div>
		);

	}

});

module.exports = Header;