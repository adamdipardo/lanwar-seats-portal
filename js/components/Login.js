var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = require('./Header');
var Footer = require('./Footer');

var Login = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("UserAccountStore")],

	getInitialState: function() {

		return {
			email: "",
			emailError: false,
			password: "",
			passwordError: false
		};

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

	attemptLogin: function(e) {

		e.preventDefault();

		if (!this.state.email || !this.state.email.trim())
			this.setState({emailError: true});

		if (!this.state.password || !this.state.password.trim())
			this.setState({passwordError: true});

		if (!this.state.emailError && !this.state.passwordError)
			this.getFlux().actions.UserAccountActions.login(this.state.email, this.state.password, this.context.router.getCurrentQuery().return, this.context.router);

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
			var loginButton = <span><button type="submit" className="btn btn-primary">Login</button></span>;
		}

		var flashMessage;
		if (this.context.router.getCurrentQuery().expired == "true") {
			flashMessage = <div className="alert alert-danger">Your session has expired. Please login again.</div>;
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-4"></div>
							<div className="col-md-4">
								<h2>Admin Login</h2>

								{flashMessage}

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
							<div className="col-md-4"></div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);

	}

});

module.exports = Login;