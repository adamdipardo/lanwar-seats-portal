var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var classNames = require('classnames');

var Header = require('./Header');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Profile = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), Navigation],

	getInitialState: function() {

		return {
			profileLoaded: false,
			updateEmailSent: false,
			updatePasswordSent: false
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		if (!UserAccountStore.isLoadingProfile && this.state && !this.state.profileLoaded)
			this.populateForm(UserAccountStore.profile);

		if (!UserAccountStore.isLoadingUpdateEmail && !UserAccountStore.updateEmailError && this.state && this.state.updateEmailSent)
			this.clearUpdateEmail();

		if (!UserAccountStore.isLoadingUpdatePassword && !UserAccountStore.updatePasswordError && this.state && this.state.updatePasswordSent)
			this.clearUpdatePassword();

		return {
			isLoadingProfile: UserAccountStore.isLoadingProfile,
			profile: UserAccountStore.profile,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingUpdateProfile: UserAccountStore.isLoadingUpdateProfile,
			isLoadingUpdateEmail: UserAccountStore.isLoadingUpdateEmail,
			isLoadingUpdatePassword: UserAccountStore.isLoadingUpdatePassword
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.UserAccountActions.getUserProfile();

	},

	handleProfileSubmit: function(e) {

		e.preventDefault();

		firstNameError = "";
		lastNameError = "";

		var hasError = false;

		if (!this.state.firstName || this.state.firstName.trim().length == 0) {
			firstNameError = "Please enter a name.";
			hasError = true;
		}

		if (!this.state.lastName || this.state.lastName.trim().length == 0) {
			lastNameError = "Please enter a name.";
			hasError = true;
		}

		this.setState({firstNameError: firstNameError, lastNameError: lastNameError});

		if (!hasError) {
			this.getFlux().actions.UserAccountActions.updateProfile(this.state.profile.id, this.state.firstName, this.state.lastName, this.state.gamerTag);
		}

	},

	handleEmailSubmit: function(e) {

		e.preventDefault();

		newEmailError = "";
		currentPasswordError = "";

		var hasError = false;

		if (!this.state.newEmail || this.state.newEmail.trim() == 0 || !(/@/.test(this.state.newEmail))) {
			newEmailError = "Please enter an email address.";
			hasError = true;
		}

		if (!this.state.currentPassword || this.state.currentPassword.trim() == 0) {
			currentPasswordError = "Please enter your LANWAR password.";
			hasError = true;
		}

		this.setState({newEmailError: newEmailError, currentPasswordError: currentPasswordError});

		if (!hasError) {
			this.setState({updateEmailSent: true});
			this.getFlux().actions.UserAccountActions.updateEmail(this.state.profile.id, this.state.newEmail, this.state.currentPassword);
		}

	},

	handlePasswordSubmit: function(e) {

		e.preventDefault();

		currentPassword2Error = "";
		newPasswordError = "";
		confirmPasswordError = "";

		var hasError = false;

		if (!this.state.currentPassword2 || this.state.currentPassword2.trim() == 0) {
			currentPassword2Error = "Please enter your LANWAR password.";
			hasError = true;
		}

		if (!this.state.newPassword || this.state.newPassword.trim() < 6) {
			newPasswordError = "Please enter your new password.";
			hasError = true;
		}

		if (this.state.confirmPassword != this.state.newPassword) {
			confirmPasswordError = "Passwords must match.";
			hasError = true;
		}

		this.setState({currentPassword2Error: currentPassword2Error, newPasswordError: newPasswordError, confirmPasswordError: confirmPasswordError});

		if (!hasError) {
			this.setState({updatePasswordSent: true});
			this.getFlux().actions.UserAccountActions.updatePassword(this.state.profile.id, this.state.currentPassword2, this.state.newPassword);
		}

	},

	updateForm: function(e) {

		this.state[e.target.name] = e.target.value;

		this.setState(this.state);

	},

	populateForm: function(profile) {

		this.setState({firstName: profile.firstName, lastName: profile.lastName, gamerTag: profile.gamerTag, profileLoaded: true});

	},

	clearUpdateEmail: function() {

		this.setState({newEmail: "", currentPassword: "", updateEmailSent: false});

	},

	clearUpdatePassword: function() {

		this.setState({currentPassword2: "", newPassword: "", confirmPassword: "", updatePasswordSent: false});

	},

	render: function() {

		// permission
		if (!this.state.isLoggedIn && !this.state.isLoadingSessionCheck)
			this.transitionTo('/');

		// while loading only show icon
		if (this.state.isLoadingProfile) {
			return (
				<div>
					<Header />
					<div className="container-fluid body">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<div className="loading-circle padding"><i className="fa fa-circle-o-notch fa-spin fa-4x"></i></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// update profile button
		if (this.state.isLoadingUpdateProfile)
			var updateProfileButton = <button type="submit" className="btn btn-primary" disabled="disabled">Updating... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		else
			var updateProfileButton = <button type="submit" className="btn btn-primary">Update</button>;

		// update email button
		if (this.state.isLoadingUpdateEmail)
			var updateEmailButton = <button type="submit" className="btn btn-primary" disabled>Updating... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		else
			var updateEmailButton = <button type="submit" className="btn btn-primary">Update Email</button>;

		if (this.state.isLoadingUpdatePassword)
			var updatePasswordButton = <button type="submit" className="btn btn-primary" disabled="disabled">Updating... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		else
			var updatePasswordButton = <button type="submit" className="btn btn-primary">Update Password</button>;

		// show forms
		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<div className="row">
									<div className="col-md-12">
										<h2>My Profile</h2>

										<p>Edit your profile below.</p>
									</div>
								</div>
								<form className="form" onSubmit={this.handleProfileSubmit} novalidate>
								<div className="row">
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.firstNameError})}>
											<label htmlFor="firstName">First Name</label>
											<input type="text" name="firstName" id="firstName" value={this.state.firstName} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.firstNameError}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.lastNameError})}>
											<label htmlFor="lastName">Last Name</label>
											<input type="text" name="lastName" id="lastName" value={this.state.lastName} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.lastNameError}</span>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<div className="form-group">
											<label htmlFor="gamerTag">Gamer Tag</label>
											<input type="text" name="gamerTag" id="gamerTag" value={this.state.gamerTag} onChange={this.updateForm} className="form-control" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<div className="form-group">
											{updateProfileButton}
										</div>
									</div>
								</div>
								</form>

								<form className="form" onSubmit={this.handleEmailSubmit} novalidate>
								<div className="row">
									<div className="col-md-12">
										<h3>Update Email</h3>
										<p>Your email address is currently set to <strong>{this.state.profile.email}</strong>, to update it, please enter in the new address below.</p>
									</div>
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.newEmailError})}>
											<label htmlFor="newEmail">New Email</label>
											<input type="email" name="newEmail" id="newEmail" value={this.state.newEmail} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.newEmailError}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.currentPasswordError})}>
											<label htmlFor="currentPassword">Current Password</label>
											<input type="password" name="currentPassword" id="currentPassword" value={this.state.currentPassword} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.currentPasswordError}</span>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<div className="form-group">
											{updateEmailButton}
										</div>
									</div>
								</div>
								</form>

								<form className="form" onSubmit={this.handlePasswordSubmit} novalidate>
								<div className="row">
									<div className="col-md-12">
										<h3>Update Password</h3>
										<p>Update your password below.</p>
									</div>
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.currentPassword2Error})}>
											<label htmlFor="currentPassword2">Current Password</label>
											<input type="password" name="currentPassword2" id="currentPassword2" value={this.state.currentPassword2} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.currentPassword2Error}</span>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.newPasswordError})}>
											<label htmlFor="newPassword">New Password</label>
											<input type="password" name="newPassword" id="newPassword" value={this.state.newPassword} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.newPasswordError}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className={classNames("form-group", {'has-error': this.state.confirmPasswordError})}>
											<label htmlFor="confirmPassword">Confirm</label>
											<input type="password" name="confirmPassword" id="confirmPassword" value={this.state.confirmPassword} onChange={this.updateForm} className="form-control" />
											<span className="help-block">{this.state.confirmPasswordError}</span>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<div className="form-group">
											{updatePasswordButton}
										</div>
									</div>
								</div>
								</form>
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				</div>
			</div>
		);

	}

});

module.exports = Profile;