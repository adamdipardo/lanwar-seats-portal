var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var AdminUsersStore = Fluxxor.createStore({

	initialize: function() {
		this.isLoadingUsers = false;
		this.users = [];
		this.usersPaging = {};
		this.isLoadingEditUser = false;
		this.editUserError = "";
		this.editUser = {};

		this.bindActions(
			LanwarConstants.ADMIN_USERS_LOADING, this.onUsersLoading,
			LanwarConstants.ADMIN_USERS_SUCCESS, this.onUsersSuccess,
			LanwarConstants.ADMIN_USERS_ERROR, this.onUsersError,
			LanwarConstants.ADMIN_EDIT_USER_LOADING, this.onEditUserLoading,
			LanwarConstants.ADMIN_EDIT_USER_SUCCESS, this.onEditUserSuccess,
			LanwarConstants.ADMIN_EDIT_USER_ERROR, this.onEditUserError,
			LanwarConstants.ADMIN_EDIT_USER_OPEN, this.onEditUserOpen,
			LanwarConstants.ADMIN_EDIT_USER_CLOSE, this.onEditUserClose
		);
	},

	onUsersLoading: function(payload) {

		this.isLoadingUsers = true;
		this.users = [];
		this.usersPaging.currentPage = payload.page;
		this.emit("change");

	},

	onUsersSuccess: function(payload) {

		this.isLoadingUsers = false;
		this.users = payload.users;
		this.usersPaging = {
			from: payload.from,
			to: payload.to,
			currentPage: payload.currentPage,
			lastPage: payload.lastPage,
			count: payload.count
		};
		this.emit("change");

	},

	onUsersError: function(payload) {

		this.isLoadingUsers = false;
		this.emit("change");

		if (payload.error != 'Permission denied')
			alert(payload.error);

	},

	onEditUserLoading: function(payload) {

		this.isLoadingEditUser = true;
		this.editUserError = "";
		this.emit("change");

	},

	onEditUserSuccess: function(payload) {

		this.isLoadingEditUser = false;
		this.editUser = {};
		
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].id == payload.id) {
				this.users[i].type = payload.type;
			}
		}

		this.emit("change");

	},

	onEditUserError: function(payload) {

		this.isLoadingEditUser = false;

		if (payload.error != 'Permission denied')
			this.editUserError = payload.error;

		this.emit("change");

	},

	onEditUserOpen: function(payload) {

		this.editUser = payload.user;
		this.editUserError = "";
		this.emit("change");

	},

	onEditUserClose: function(payload) {

		this.editUser = {};
		this.emit("change");

	},

	getState: function() {
		return {
			isLoadingUsers: this.isLoadingUsers,
			users: this.users,
			usersPaging: this.usersPaging,
			isLoadingEditUser: this.isLoadingEditUser,
			editUserError: this.editUserError,
			editUser: this.editUser
		};
	}

});

module.exports = AdminUsersStore;