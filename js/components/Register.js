var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var RegisterBasicFields = require('./RegisterBasicFields');
var Header = require('./Header');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Register = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), Navigation],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoadingRegister: UserAccountStore.isLoadingRegister
		};

	},

	handleSubmit: function(e) {

		e.preventDefault();

		if (this.refs.basicFormFields.isValid())
		{
			var formData = this.refs.basicFormFields.getFormData();
			this.getFlux().actions.UserAccountActions.register(formData, this.context.router);
		}

	},

	render: function() {

		// permission
		if (this.state.isLoggedIn && !this.state.isLoadingSessionCheck)
			this.transitionTo('/profile');

		if (this.state.isLoadingRegister)
			var registerButton = <button type="submit" className="pull-right btn btn-primary" disabled="disabled">Registering... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		else
			var registerButton = <button type="submit" className="pull-right btn btn-primary">Register</button>;

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<form className="form" onSubmit={this.handleSubmit}>
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Register</h2>
								<p>Register to create an account. You will need an account to claim tickets given to you, register or join teams, and sign up for tournaments.</p>
								<RegisterBasicFields ref="basicFormFields"/>
								{registerButton}
							</div>
							<div className="col-md-2"></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);

	}

});

module.exports = Register;