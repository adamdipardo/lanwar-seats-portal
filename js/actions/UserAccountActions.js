var LanwarConstants = require('../constants/LanwarConstants');

var UserAccountActions = {
	login: function(email, password, router) {
		this.dispatch(LanwarConstants.LOGIN_LOADING, {});

		$.ajax({
			url: '/api/sessions/create',
			type: 'post',
			data: {email: email, password: password},
			success: function(result) {
				result.router = router;
				this.dispatch(LanwarConstants.LOGIN_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.LOGIN_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	},
	checkForSession: function() {
		this.dispatch(LanwarConstants.SESSION_CHECK_LOADING, {});

		$.ajax({
			url: '/api/sessions/check',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.SESSION_CHECK_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.SESSION_CHECK_ERROR, {error: JSON.parse(xhr.responseText).error});
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
	logout: function(router) {
		$.ajax({
			url: '/api/sessions/destroy',
			type: 'post',
			success: function(result) {
				this.dispatch(LanwarConstants.LOGOUT_SUCCESS, {});
				router.transitionTo('/');
			}.bind(this),
			error: function(xhr) {
				// 
			}.bind(this)
		});
	},
	register: function(formFields, router) {
		this.dispatch(LanwarConstants.REGISTER_LOADING, {});

		$.ajax({
			url: '/api/users/create',
			type: 'post',
			data: {firstName: formFields.firstName, lastName: formFields.lastName, email: formFields.email, password: formFields.password},
			success: function(result) {
				this.dispatch(LanwarConstants.REGISTER_SUCCESS, result);
				router.transitionTo('/register/finish');
			}.bind(this),
			error: function(xhr) {
				this.dispatch(LanwarConstants.REGISTER_ERROR, {error: JSON.parse(xhr.responseText).error});
			}.bind(this)
		});
	}
};

module.exports = UserAccountActions;