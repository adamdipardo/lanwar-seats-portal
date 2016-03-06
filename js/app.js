var Fluxxor = require("fluxxor");
var React = require("react");
var render = require("react-dom").render;
var Router = require("react-router").Router;
var Route = require("react-router").Route;
var IndexRoute = require("react-router").IndexRoute;
var history = require('./history');

var LanwarConfig = require('./LanwarConfig');

var TicketTypesStore = require('./stores/TicketTypesStore');
var TicketTypesActions = require('./actions/TicketTypesActions');
var BuyTicketsStore = require('./stores/BuyTicketsStore');
var BuyTicketsActions = require('./actions/BuyTicketsActions');
var RoomsStore = require('./stores/RoomsStore');
var UserAccountStore = require('./stores/UserAccountStore');
var AdminOrdersStore = require('./stores/AdminOrdersStore');
var CheckInStore = require('./stores/CheckInStore');
var RoomsActions = require('./actions/RoomsActions');
var SeatAvailabilityStore = require('./stores/SeatAvailabilityStore');
var SeatAvailabilityActions = require('./actions/SeatAvailabilityActions');
var UserAccountActions = require('./actions/UserAccountActions');
var AdminOrdersActions = require('./actions/AdminOrdersActions');
var CheckInActions = require('./actions/CheckInActions');
var AdminTicketsActions = require('./actions/AdminTicketsActions');
var AdminTicketsStore = require('./stores/AdminTicketsStore');
var OrderActions = require('./actions/OrderActions');
var OrderStore = require('./stores/OrderStore');
var AdminUsersActions = require('./actions/AdminUsersActions');
var AdminUsersStore = require('./stores/AdminUsersStore');
var AdminOverviewActions = require('./actions/AdminOverviewActions');
var AdminOverviewStore = require('./stores/AdminOverviewStore');

var BuyTickets = require('./components/BuyTickets');
var SelectSeats = require('./components/SelectSeats');
var Checkout = require('./components/Checkout');
var CheckoutFinish = require('./components/CheckoutFinish');
var Profile = require('./components/Profile');
var Register = require('./components/Register');
var RegisterSuccess = require('./components/RegisterSuccess');
var AdminOrders = require('./components/admin/Orders');
var AdminOrderDetail = require('./components/admin/OrderDetail');
var AdminScan = require('./components/admin/Scan');
var AdminTickets = require('./components/admin/CheckedInTickets');
var RoomsView = require('./components/admin/RoomsView');
var PrintableSeats = require('./components/admin/PrintableSeats');
var AdminUsers = require('./components/admin/Users');
var ChooseOptions = require('./components/ChooseOptions');
var Login = require('./components/Login');
var TicketEmails = require('./components/TicketEmails');
var AdminOverview = require('./components/admin/Overview');

var stores = {
	TicketTypesStore: new TicketTypesStore(),
	BuyTicketsStore: new BuyTicketsStore(),
	RoomsStore: new RoomsStore(),
	SeatAvailabilityStore: new SeatAvailabilityStore(),
	UserAccountStore: new UserAccountStore(),
	AdminOrdersStore: new AdminOrdersStore(),
	CheckInStore: new CheckInStore(),
	AdminTicketsStore: new AdminTicketsStore(),
	OrderStore: new OrderStore(),
	AdminUsersStore: new AdminUsersStore(),
	AdminOverviewStore: new AdminOverviewStore()
};

var actions = {
	TicketTypesActions: TicketTypesActions,
	BuyTicketsActions: BuyTicketsActions,
	RoomsActions: RoomsActions,
	SeatAvailabilityActions: SeatAvailabilityActions,
	UserAccountActions: UserAccountActions,
	AdminOrdersActions: AdminOrdersActions,
	CheckInActions: CheckInActions,
	AdminTicketsActions: AdminTicketsActions,
	OrderActions: OrderActions,
	AdminUsersActions: AdminUsersActions,
	AdminOverviewActions: AdminOverviewActions
}

var flux = new Fluxxor.Flux(stores, actions);

if (LanwarConfig.stripePK.indexOf('_live_') == -1) {
	flux.on("dispatch", function(type, payload) {
		if (console && console.log) {
			console.log("[Dispatch]", type, payload);
		}
	});
}

// check for session
flux.actions.UserAccountActions.checkForSession();

// keep checking session
var sessionCheckInterval = setInterval(function() { 
	if (flux.store('UserAccountStore').getState().isLoggedIn)
		flux.actions.UserAccountActions.checkForSession(true);
}, 60 * 1000)

// Router.run(routes, function(Handler) {
// 	React.render(
//     	<Handler flux={flux} />,
//     	document.getElementById("lanwar-app")
//   	);
// });

function createFluxComponent(Component, props) {
  return <Component {...props} flux={flux} />;
}

render((<Router createElement={createFluxComponent} history={history}>
		<Route name="home" path="/">
			<IndexRoute component={BuyTickets}/>
			<Route name="choose-options" path="choose-options" component={TicketEmails}/>
			<Route name="select-seats" path="select-seats" component={SelectSeats}/>
			<Route name="checkout" path="checkout" component={Checkout}/>
			<Route name="checkout-finish" path="checkout-finish" component={CheckoutFinish}/>
			<Route name="profile" path="profile" component={Profile}/>
			<Route name="register" path="register">
				<IndexRoute component={Register}/>
				<Route name="register-finish" path="finish" component={RegisterSuccess} />
			</Route>
			<Route name="admin" path="admin">
				<Route name="admin-orders" path="orders">
					<IndexRoute component={AdminOrders}/>
					<Route name="admin-order-detail" path=":orderId">
						<IndexRoute component={AdminOrderDetail}/>
						<Route name="admin-order-detail-select-seats" path="select-seats" component={SelectSeats} />
					</Route>
				</Route>				
				<Route name="admin-scan" path="scan" component={AdminScan} />
				<Route name="admin-checked-in-tickets" path="checked-in-tickets" component={AdminTickets} />
				<Route name="admin-rooms-view" path="rooms-view" component={RoomsView} />
				<Route name="admin-rooms-print" path="rooms/print" component={PrintableSeats} />
				<Route name="admin-users" path="users" component={AdminUsers} />
				<Route name="admin-overview" path="overview" component={AdminOverview} />
			</Route>
			<Route name="order" path="order/:orderHash">
				<IndexRoute component={CheckoutFinish}/>
				<Route name="order-select-seats" path="select-seats" component={SelectSeats} />
			</Route>
			<Route name="login" path="login" component={Login} />
		</Route>
	</Router>), document.getElementById("lanwar-app"));
