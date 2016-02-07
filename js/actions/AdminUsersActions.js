var LanwarConstants = require('../constants/LanwarConstants');
var history = require('../history');

var AdminUsersActions = {

	getUsers: function(pageNum, sortKey, sortDirection) {
		this.dispatch(LanwarConstants.ADMIN_USERS_LOADING, {page: pageNum || 1});

		var ordersData = {
			page: pageNum || 1, 
			sort: sortKey || 'lastName', 
			sortDirection: sortDirection || 'asc'
		};

		$.ajax({
			url: '/api/users/read',
			type: 'post',
			data: ordersData,
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_USERS_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "Sorry, there was an error. Please try again later.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.ADMIN_USERS_ERROR, {error: errorStr});
			}.bind(this)
		});
	},

	editUser: function(id, type, password) {
		this.dispatch(LanwarConstants.ADMIN_EDIT_USER_LOADING, {});

		var editData = {
			type: type
		};

		if (password)
			editData.password = password;

		$.ajax({
			url: '/api/users/' + id + '/admin/update',
			type: 'post',
			data: editData,
			success: function(result) {
				this.dispatch(LanwarConstants.ADMIN_EDIT_USER_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				try {
					var errorStr = JSON.parse(xhr.responseText).error;

					if (!errorStr)
						throw true;
				}
				catch (e) {
					var errorStr = "Sorry, there was an error. Please try again later.";
				}

				if (errorStr == "Permission denied")
					this.dispatch(LanwarConstants.SESSION_TIMEOUT, {});
				else
					this.dispatch(LanwarConstants.ADMIN_EDIT_USER_ERROR, {error: errorStr});
			}.bind(this)
		});
	},

	openEditUserModal: function(user) {
		this.dispatch(LanwarConstants.ADMIN_EDIT_USER_OPEN, {user: user});
	},

	closeEditUserModal: function() {
		this.dispatch(LanwarConstants.ADMIN_EDIT_USER_CLOSE, {});
	}
};

module.exports = AdminUsersActions;