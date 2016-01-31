var LanwarConstants = require('../constants/LanwarConstants');
var history = require('../history');

var UserAccountActions = {
	login: function(email, password, redirectUrl) {
		this.dispatch(LanwarConstants.LOGIN_LOADING, {});

		$.ajax({
			url: '/api/sessions/create',
			type: 'post',
			data: {email: email, password: password},
			success: function(result) {
				this.dispatch(LanwarConstants.LOGIN_SUCCESS, result);
				if (result.type == 'admin')
					history.replaceState(null, redirectUrl || '/admin/orders');
				else
					history.replaceState(null, '/profile');
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOGIN_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	checkForSession: function(isSilent) {
		if (!isSilent)
			this.dispatch(LanwarConstants.SESSION_CHECK_LOADING, {});

		$.ajax({
			url: '/api/sessions/check',
			type: 'post',
			success: function(result) {
				if (!isSilent)
					this.dispatch(LanwarConstants.SESSION_CHECK_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				if (!isSilent)
					this.dispatch(LanwarConstants.SESSION_CHECK_ERROR, {error: JSON.parse(xhr.responseText).error});
				else
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
			}.bind(this)
		});
	},
	getUserProfile: function() {
		this.dispatch(LanwarConstants.USER_PROFILE_LOADING, {});

		$.ajax({
			url: '/api/users/profile',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.USER_PROFILE_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.USER_PROFILE_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	updateProfile: function(userId, firstName, lastName, gamerTag) {
		this.dispatch(LanwarConstants.UPDATE_PROFILE_LOADING, {});

		$.ajax({
			url: '/api/users/' + userId + '/update',
			type: 'post',
			data: {firstName: firstName, lastName: lastName, gamerTag: gamerTag},
			success: function(result) {
				this.dispatch(LanwarConstants.UPDATE_PROFILE_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.UPDATE_PROFILE_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	updateEmail: function(userId, email, password) {
		this.dispatch(LanwarConstants.UPDATE_EMAIL_LOADING, {});

		$.ajax({
			url: '/api/users/' + userId + '/email/update',
			type: 'post',
			data: {email: email, password: password},
			success: function(result) {
				this.dispatch(LanwarConstants.UPDATE_EMAIL_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.UPDATE_EMAIL_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	updatePassword: function(userId, currentPassword, newPassword) {
		this.dispatch(LanwarConstants.UPDATE_PASSWORD_LOADING, {});

		$.ajax({
			url: '/api/users/' + userId + '/password/update',
			type: 'post',
			data: {currentPassword: currentPassword, newPassword: newPassword},
			success: function(result) {
				this.dispatch(LanwarConstants.UPDATE_PASSWORD_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.UPDATE_PASSWORD_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	logout: function() {
		$.ajax({
			url: '/api/sessions/destroy',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOGOUT_SUCCESS, {});
				history.replaceState(null, '/');
			}.bind(this),
			error: function(xhr) {
				// 
			}.bind(this)
		});
	},
	register: function(formFields) {
		this.dispatch(LanwarConstants.REGISTER_LOADING, {});

		$.ajax({
			url: '/api/users/create',
			type: 'post',
			data: {firstName: formFields.firstName, lastName: formFields.lastName, email: formFields.email, password: formFields.password},
			success: function(result) {
				this.dispatch(LanwarConstants.REGISTER_SUCCESS, result);
				history.replaceState(null, '/register/finish');
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.REGISTER_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	dismissSessionTimedOutModal: function(pathName) {
		history.replaceState(null, '/login', {expired: true, return: pathName})
		this.dispatch(LanwarConstants.DISMISSED_SESSION_TIMEOUT, {});
	}
};

module.exports = UserAccountActions;