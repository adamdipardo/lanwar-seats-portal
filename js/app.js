var Fluxxor = require("fluxxor");
var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

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
var ChooseOptions = require('./components/ChooseOptions');
var Login = require('./components/Login');

var routes = (
	<Route name="home" path="/">
		<Route name="choose-options" path="/choose-options" handler={ChooseOptions}/>
		<Route name="select-seats" path="/select-seats" handler={SelectSeats}/>
		<Route name="checkout" path="/checkout" handler={Checkout}/>
		<Route name="checkout-finish" path="/checkout-finish" handler={CheckoutFinish}/>
		<Route name="profile" path="/profile" handler={Profile}/>
		<Route name="register" path="/register">
			<Route name="register-finish" path="/register/finish" handler={RegisterSuccess} />
			<DefaultRoute handler={Register} />
		</Route>
		<Route name="admin" path="/admin">
			<Route name="admin-orders" path="/admin/orders" handler={AdminOrders} />
			<Route name="admin-order-detail" path="/admin/orders/:orderId" handler={AdminOrderDetail} />
			<Route name="admin-scan" path="/admin/scan" handler={AdminScan} />
			<Route name="admin-checked-in-tickets" path="/admin/checked-in-tickets" handler={AdminTickets} />
		</Route>
		<Route name="order" path="/order/:orderHash" handler={CheckoutFinish}/>
		<Route name="order-select-seats" path="/order/:orderHash/select-seats" handler={SelectSeats} />
		<Route name="login" path="/login" handler={Login} />
		<DefaultRoute handler={BuyTickets} />
	</Route>
);

var stores = {
	TicketTypesStore: new TicketTypesStore(),
	BuyTicketsStore: new BuyTicketsStore(),
	RoomsStore: new RoomsStore(),
	SeatAvailabilityStore: new SeatAvailabilityStore(),
	UserAccountStore: new UserAccountStore(),
	AdminOrdersStore: new AdminOrdersStore(),
	CheckInStore: new CheckInStore(),
	AdminTicketsStore: new AdminTicketsStore(),
	OrderStore: new OrderStore()
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
	OrderActions: OrderActions
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

Router.run(routes, function(Handler) {
	React.render(
    	<Handler flux={flux} />,
    	document.getElementById("lanwar-app")
  	);
});
