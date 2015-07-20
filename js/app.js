var Fluxxor = require("fluxxor");
var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var TicketTypesStore = require('./stores/TicketTypesStore');
var TicketTypesActions = require('./actions/TicketTypesActions');
var BuyTicketsStore = require('./stores/BuyTicketsStore');
var BuyTicketsActions = require('./actions/BuyTicketsActions');
var RoomsStore = require('./stores/RoomsStore');
var RoomsActions = require('./actions/RoomsActions');
var SeatAvailabilityStore = require('./stores/SeatAvailabilityStore');
var SeatAvailabilityActions = require('./actions/SeatAvailabilityActions');

var BuyTickets = require('./components/BuyTickets');
var SelectSeats = require('./components/SelectSeats');
var Checkout = require('./components/Checkout');
var CheckoutFinish = require('./components/CheckoutFinish');

var routes = (
	<Route name="home" path="/">
		<Route name="select-seats" path="/select-seats" handler={SelectSeats}/>
		<Route name="checkout" path="/checkout" handler={Checkout}/>
		<Route name="checkout-finish" path="/checkout-finish" handler={CheckoutFinish}/>
		<DefaultRoute handler={BuyTickets} />
	</Route>
);

var stores = {
	TicketTypesStore: new TicketTypesStore(),
	BuyTicketsStore: new BuyTicketsStore(),
	RoomsStore: new RoomsStore(),
	SeatAvailabilityStore: new SeatAvailabilityStore()
};

var actions = {
	TicketTypesActions: TicketTypesActions,
	BuyTicketsActions: BuyTicketsActions,
	RoomsActions: RoomsActions,
	SeatAvailabilityActions: SeatAvailabilityActions
}

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
	if (console && console.log) {
		console.log("[Dispatch]", type, payload);
	}
});

Router.run(routes, function(Handler) {
	React.render(
    	<Handler flux={flux} />,
    	document.getElementById("app")
  	);
});
