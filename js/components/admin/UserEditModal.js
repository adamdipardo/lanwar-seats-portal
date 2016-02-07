var React = require('react');
var Fluxxor = require('fluxxor');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var FluxMixin = Fluxxor.FluxMixin(React);

var UserEditModal = React.createClass({

	mixins: [FluxMixin],

	getInitialState: function() {

		return {

		};

	},

	componentWillReceiveProps: function(nextProps) {

		if (this.props.user.id != nextProps.user.id) {
			this.setState({type: nextProps.user.type});
		}

	},

	handleFormChange: function(e) {

		var newProperty = {};
		newProperty[e.target.name] = e.target.value;
		this.setState(newProperty);

	},

	handleFormSubmit: function(e) {

		e.preventDefault();

		this.setState({passwordError: ""});

		if (this.state.password && (this.state.password.trim().length < 6 || this.state.password != this.state.confirmPassword)) {
			this.setState({passwordError: 'Passwords must match and be at least 6 characters long.'})
		}
		else {
			this.getFlux().actions.AdminUsersActions.editUser(this.props.user.id, this.state.type, this.state.password);
		}

	},

	handleHide: function() {

		this.props.onCancelEditUser();
		this.setState({passwordError: ""});

	},

	render: function() {

		if (!this.props.show)
			return (<div></div>);

		var saveButton;
		if (this.props.isLoading)
			saveButton = <button type="submit" className="btn btn-primary" disabled="disabled">Saving.. <i className="fa fa-spin fa-circle-o-notch"></i></button>;
		else
			saveButton = <button type="submit" className="btn btn-primary">Save</button>;

		var passwordError;
		if (this.state.passwordError)
			passwordError = <p className="text-danger">{this.state.passwordError}</p>;

		var editError;
		if (this.props.error)
			editError = <div className="alert">{this.props.error}</div>;

		return (
			<Modal.Dialog dialogClassName='edit-user' animation={false} onHide={this.handleHide}>
				<h3>{this.props.user.firstName} {this.props.user.lastName}</h3>

				<form className="form" onSubmit={this.handleFormSubmit} noValidate>
				<div className="form-group">
					<label htmlFor="type">User Type</label>
					<select name="type" id="type" onChange={this.handleFormChange} value={this.state.type} className="form-control">
						<option value="admin">Admin</option>
						<option value="regular">Regular</option>
					</select>
				</div>
				<h4>Set/Update Password</h4>
				<span className="help-block">Leave blank if not changing.</span>
				<div className="form-group">
					<label htmlFor="password">New Password</label>
					<input type="password" name="password" id="password" className="form-control" value={this.state.password} onChange={this.handleFormChange} />
					{passwordError}
				</div>
				<div className="form-group">
					<label htmlFor="confirmPassword">Confirm New Password</label>
					<input type="password" name="confirmPassword" id="confirmPassword" className="form-control" value={this.state.confirmPassword} onChange={this.handleFormChange} />
				</div>
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.handleHide}>Cancel</button>
					{saveButton}
				</div>
				{editError}
				</form>
			</Modal.Dialog>
		);

	}

});

module.exports = UserEditModal;