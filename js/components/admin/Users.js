var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
var Link = require('react-router').Link;
var moment = require('moment');

var LanwarConfig = require('../../LanwarConfig');
var LanwarConstants = require('../../constants/LanwarConstants');
var Header = require('../Header');
var Footer = require('../Footer');
var PagingButtons = require('../PagingButtons');
var UserEditModal = require('./UserEditModal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Users = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminUsersStore"), History],

	getInitialState: function() {

		return {
			page: 1,
			sort: 'lastName',
			sortDirection: 'asc'
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminUsersStore = flux.store("AdminUsersStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoadingUsers: AdminUsersStore.isLoadingUsers,
			users: AdminUsersStore.users,
			usersPaging: AdminUsersStore.usersPaging,
			user: UserAccountStore.user,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingEditUser: AdminUsersStore.isLoadingEditUser,
			editUserError: AdminUsersStore.editUserError,
			editUser: AdminUsersStore.editUser
		};

	},

	componentDidMount: function() {

		this.getUsers();

	},

	handleClickNewPage: function(newPage) {

		this.setState({page: newPage});
		this.getUsers(newPage);

	},

	sortUsers: function(sortKey, e) {

		if (this.state.sort == sortKey) {
			var sortDir = this.state.sortDirection == 'asc' ? 'desc' : 'asc';
		}
		else {
			var sortDir = 'asc';
		}

		this.setState({sortDirection: sortDir}, function() {
			this.setState({sort: sortKey}, function() {
				this.getUsers(1);
			});	
		});

	},

	getPrettyDate: function(unixTime) {

		return moment(unixTime, "X").format('YYYY-MM-DD @ h:mm a');

	},

	getShortPrettyDate: function(unixTime) {

		return moment(unixTime, "X").format('YYYY-MM-DD');

	},

	getUsers: function(page) {

		if (typeof(page) == "undefined")
			page = this.state.page;
		
		this.getFlux().actions.AdminUsersActions.getUsers(page, this.state.sort, this.state.sortDirection);

	},

	handleEditUserClick: function(user, e) {

		this.getFlux().actions.AdminUsersActions.openEditUserModal(user);

	},

	handleCancelEditUser: function() {
		this.getFlux().actions.AdminUsersActions.closeEditUserModal();
	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.history.pushState(null, '/login', {expired: true, return: this.props.location.pathname});

		var userRows = [];
		if (this.state.isLoadingOrders == true) {
			userRows.push(<tr key={0}><td colSpan="6" className="loading-row">Loading... <i className="fa fa-circle-o-notch fa-spin"></i></td></tr>)
		}
		else {		
			for (var i = 0; i < this.state.users.length; i++) {
				var user = this.state.users[i];
				userRows.push(<tr key={i}><td>{user.id}</td><td>{user.lastName}</td><td>{user.firstName}</td><td>{this.getPrettyDate(user.created)}</td><td>{user.lastAttended ? this.getShortPrettyDate(user.lastAttended) : "–"}</td><td><a onClick={this.handleEditUserClick.bind(this, user)}>Edit</a></td></tr>);
			}
		}

		var paging = null;
		if (this.state.usersPaging.from) {
			paging = (
				<div className="row paging">
					<div className="col-md-6">
						<p className="orders-showing-count">Showing {this.state.usersPaging.from} to {this.state.usersPaging.to} of {this.state.usersPaging.count}</p>
					</div>
					<div className="col-md-6" style={{textAlign: "right"}}>
						<PagingButtons currentPage={this.state.usersPaging.currentPage} lastPage={this.state.usersPaging.lastPage} onClickNewPage={this.handleClickNewPage} />
					</div>
				</div>
			);
		}

		var sortIcons = {
			lastName: null,
			firstName: null,
			created: null,
			lastEvent: null
		};
		for (var sortIcon in sortIcons) {
			if (sortIcon == this.state.sort) {
				sortIcons[sortIcon] = <i className={"fa fa-sort-" + this.state.sortDirection}></i>;
			}
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Users</h2>

								{paging}

								<table className="table table-striped orders-table">
								<thead>
								<tr>
									<th width="10%">User #</th>
									<th width="20%"><a onClick={this.sortUsers.bind(this, 'lastName')}>Last {sortIcons.lastName}</a></th>
									<th width="20%"><a onClick={this.sortUsers.bind(this, 'firstName')}>First {sortIcons.firstName}</a></th>
									<th width="20%"><a onClick={this.sortUsers.bind(this, 'created')}>Created {sortIcons.created}</a></th>
									<th width="20%"><a onClick={this.sortUsers.bind(this, 'lastEvent')}>Last Event {sortIcons.lastEvent}</a></th>
									<th width="10%"></th>
								</tr>
								</thead>
								<tbody>
									{userRows}
								</tbody>
								</table>

								{paging}
							</div>
						</div>
					</div>
				</div>
				<Footer />
				<UserEditModal user={this.state.editUser} show={this.state.editUser.id} isLoading={this.state.isLoadingEditUser} onCancelEditUser={this.handleCancelEditUser} error={this.state.editUserError}/>
			</div>
		);

	}

});

module.exports = Users;