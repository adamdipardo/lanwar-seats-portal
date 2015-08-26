var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');
var _ = require('underscore');
var moment = require('moment');

var UserAccountStore = Fluxxor.createStore({
	initialize: function() {
		this.isLoadingLogin = false;
		this.isLoggedIn = false;
		this.isLoadingSessionCheck = true;
		this.user = {};
		this.profile = {};
		this.isLoadingProfile = false;
		this.isLoadingUpdateProfile = false;
		this.isLoadingUpdateEmail = false;
		this.updateEmailError = null;
		this.isLoadingUpdatePassword = false;
		this.updatePasswordError = null;
		this.isLoadingRegister = false;

		this.bindActions(
			LanwarConstants.LOGIN_LOADING, this.onLoginLoading,
			LanwarConstants.LOGIN_SUCCESS, this.onLoginSuccess,
			LanwarConstants.LOGIN_ERROR, this.onLoginError,
			LanwarConstants.SESSION_CHECK_LOADING, this.onSessionCheckLoading,
			LanwarConstants.SESSION_CHECK_SUCCESS, this.onSessionCheckSuccess,
			LanwarConstants.SESSION_CHECK_ERROR, this.onSessionCheckError,
			LanwarConstants.USER_PROFILE_LOADING, this.onProfileLoading,
			LanwarConstants.USER_PROFILE_SUCCESS, this.onProfileSuccess,
			LanwarConstants.USER_PROFILE_ERROR, this.onProfileError,
			LanwarConstants.UPDATE_PROFILE_LOADING, this.onUpdateProfileLoading,
			LanwarConstants.UPDATE_PROFILE_SUCCESS, this.onUpdateProfileSuccess,
			LanwarConstants.UPDATE_PROFILE_ERROR, this.onUpdateProfileError,
			LanwarConstants.UPDATE_EMAIL_LOADING, this.onUpdateEmailLoading,
			LanwarConstants.UPDATE_EMAIL_SUCCESS, this.onUpdateEmailSuccess,
			LanwarConstants.UPDATE_EMAIL_ERROR, this.onUpdateEmailError,
			LanwarConstants.UPDATE_PASSWORD_LOADING, this.onUpdatePasswordLoading,
			LanwarConstants.UPDATE_PASSWORD_SUCCESS, this.onUpdatePasswordSuccess,
			LanwarConstants.UPDATE_PASSWORD_ERROR, this.onUpdatePasswordError,
			LanwarConstants.LOGOUT_SUCCESS, this.onLogoutSuccess,
			LanwarConstants.REGISTER_LOADING, this.onRegisterLoading,
			LanwarConstants.REGISTER_SUCCESS, this.onRegisterSuccess,
			LanwarConstants.REGISTER_ERROR, this.onRegisterError
		);
	},

	onLoginLoading: function(payload) {

		this.isLoadingLogin = true;
		this.isLoggedIn = false;
		this.emit("change");

	},

	onLoginSuccess: function(payload) {

		this.isLoadingLogin = false;
		this.isLoggedIn = true;
		this.user = payload;
		if (this.user.type == 'admin')
			payload.router.transitionTo('/admin/orders');
		else
			payload.router.transitionTo('/profile');
		this.emit("change");

	},

	onLoginError: function(payload) {

		this.isLoadingLogin = false;
		alert(payload.error);
		this.emit("change");
		
	},

	onSessionCheckLoading: function(payload) {
		this.isLoadingSessionCheck = true;
		this.emit("change");
	},

	onSessionCheckError: function(payload) {
		this.isLoadingSessionCheck = false;
		this.emit("change");
	},

	onSessionCheckSuccess: function(payload) {
		this.isLoadingSessionCheck = false;
		this.isLoggedIn = true;
		this.user = payload;
		this.emit("change");
	},

	onProfileLoading: function(payload) {
		this.isLoadingProfile = true;
		this.profile = {};
		this.emit("change");
	},

	onProfileSuccess: function(payload) {
		this.isLoadingProfile = false;
		this.profile = payload;
		this.emit("change");
	},

	onProfileError: function(payload) {
		this.isLoadingProfile = false;
		this.emit("change");
		alert(payload.error);
	},

	onUpdateProfileLoading: function(payload) {
		this.isLoadingUpdateProfile = true;
		this.emit("change");
	},

	onUpdateProfileSuccess: function(payload) {
		this.isLoadingUpdateProfile = false;
		this.profile = payload;
		this.emit("change");
	},

	onUpdateProfileError: function(payload) {
		this.isLoadingUpdateProfile = false;
		alert(payload.error);
		this.emit("change");
	},

	onUpdateEmailLoading: function(payload) {
		this.isLoadingUpdateEmail = true;
		this.updateEmailError = null;
		this.emit("change");
	},

	onUpdateEmailSuccess: function(payload) {
		this.isLoadingUpdateEmail = false;
		this.profile = payload;
		this.emit("change");
	},

	onUpdateEmailError: function(payload) {
		this.isLoadingUpdateEmail = false;
		this.updateEmailError = payload.error;
		alert(payload.error);
		this.emit("change");
	},

	onUpdatePasswordLoading: function(payload) {
		this.isLoadingUpdatePassword = true;
		this.updatePasswordError = null;
		this.emit("change");
	},

	onUpdatePasswordSuccess: function(payload) {
		this.isLoadingUpdatePassword = false;
		this.profile = payload;
		this.emit("change");
	},

	onUpdatePasswordError: function(payload) {
		this.isLoadingUpdatePassword = false;
		this.updatePasswordError = payload.error;
		alert(payload.error);
		this.emit("change");
	},

	onLogoutSuccess: function(payload) {
		this.isLoggedIn = false;
		this.user = {};
		this.profile = {};
		this.emit("change");
	},

	onRegisterLoading: function(payload) {
		this.isLoadingRegister = true;
		this.emit("change");
	},

	onRegisterSuccess: function(payload) {
		this.isLoadingRegister = false;
		this.emit("change");
	},

	onRegisterError: function(payload) {
		this.isLoadingRegister = false;
		this.emit("change");
		alert(payload.error);
	},

	getState: function() {
		return {
			isLoadingLogin: this.isLoadingLogin,
			isLoggedIn: this.isLoggedIn,
			isLoadingSessionCheck: this.isLoadingSessionCheck,
			user: this.user,
			isLoadingProfile: this.isLoadingProfile,
			profile: this.profile,
			isLoadingUpdateProfile: this.isLoadingUpdateProfile,
			isLoadingUpdateEmail: this.isLoadingUpdateEmail,
			updateEmailError: this.updateEmailError,
			isLoadingUpdatePassword: this.isLoadingUpdatePassword,
			updatePasswordError: this.updatePasswordError,
			isLoadingRegister: this.isLoadingRegister
		}
	}
});	

module.exports = UserAccountStore;