var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
// var Link = require('react-router').Link;
var moment = require('moment');
var ChartistGraph = require('react-chartist');

var LanwarConfig = require('../../LanwarConfig');
var LanwarConstants = require('../../constants/LanwarConstants');
var Header = require('../Header');
var Footer = require('../Footer');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Overview = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOverviewStore"), History],

	getInitialState: function() {

		return {
			ticketSalesGrouping: 'days'
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminOverviewStore = flux.store("AdminOverviewStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			user: UserAccountStore.user,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingTicketStats: AdminOverviewStore.isLoadingTicketStats,
			ticketStatsData: AdminOverviewStore.ticketStatsData,
			isLoadingTicketSalesOverTime: AdminOverviewStore.isLoadingTicketSalesOverTime
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.AdminOverviewActions.getTicketStats();

	},

	handleTicketSalesGroupingChange: function(e) {

		this.setState({ticketSalesGrouping: e.target.value});
		this.getFlux().actions.AdminOverviewActions.getTicketSalesOverTime(e.target.value);

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.history.pushState(null, '/login', {expired: true, return: this.props.location.pathname});

		if (this.state.isLoadingTicketStats) {
			return (
				<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Overview</h2>

								<div className="loading-circle padding"><i className="fa fa-circle-o-notch fa-spin fa-4x"></i></div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
				</div>
			);
		}

		var ticketSalesChart;
		if (!this.state.isLoadingTicketStats && !this.state.isLoadingTicketSalesOverTime && typeof(this.state.ticketStatsData.time) != "undefined" && this.state.ticketStatsData.time.length > 0) {
			var ticketLabels = [];
			var ticketSeries = []
			for (var i = 0; i < this.state.ticketStatsData.time.length; i++) {
				if (this.state.ticketSalesGrouping == 'days')
					var statDate = moment(this.state.ticketStatsData.time[i].date);
				else
					var statDate = moment(this.state.ticketStatsData.time[i].date, "YYYY-WW");

				ticketLabels.push(statDate.format('MMM D'));
				ticketSeries.push(parseInt(this.state.ticketStatsData.time[i].orders));
			}

			var ticketSalesData = {
				labels: ticketLabels,
				series: [ticketSeries]
			};

			var ticketSalesOptions = {
				low: 0,
				showArea: true,
				divisor: 5,
				axisY: {
					onlyInteger: true,
					divisor: 5,
				},
				axisX: {
					showGrid: false
				},
				lineSmooth: false
			};

			ticketSalesChart = (
				<ChartistGraph data={ticketSalesData} type={'Line'} options={ticketSalesOptions} className="ct-major-twelfth overview"/>
			);
		}
		else if (this.state.isLoadingTicketSalesOverTime)
			ticketSalesChart = <i className="chart-loading fa fa-spin fa-circle-o-notch"></i>;

		var ticketTotalsChart;
		var ticketSalesTotal;
		var ticketSalesAvailable;
		if (!this.state.isLoadingTicketStats && typeof(this.state.ticketStatsData.total) != "undefined") {
			var totalTickets = 0;
			var totalSales = 0;
			$.each(this.state.ticketStatsData.total, function(index, ticketType) {
				totalTickets += ticketType.available;
				totalSales += ticketType.sales;
			});

			var series = [];
			$.each(this.state.ticketStatsData.total, function(index, ticketType) {
				series.push(ticketType.sales / totalTickets * 100);
			});
			series.push((totalTickets - totalSales) / totalTickets * 100);

			var ticketTotalsData = {
				series: series
			};

			var ticketTotalsOptions = {
				donut: true,
				donutWidth: 20,
				startAngle: 270,
				total: 200,
				showLabel: false
			};

			console.log(totalTickets);
			console.log(totalSales);
			console.log(series);

			ticketTotalsChart = (
				<ChartistGraph data={ticketTotalsData} type={'Pie'} options={ticketTotalsOptions} className="ct-major-sixth totals" />
			);

			ticketSalesTotal = this.state.ticketStatsData.total[0].sales;
			ticketSalesAvailable = totalTickets;
		}

		var ticketStudentChart;
		if (!this.state.isLoadingTicketStats && typeof(this.state.ticketStatsData.student) != "undefined") {

			var ticketStudentData = {
				labels: ['Student', 'Not Student'],
				series: [this.state.ticketStatsData.student.student, this.state.ticketStatsData.student.notStudent]
			};

			console.log(['Student', 'Not Student']);
			console.log([this.state.ticketStatsData.student.student, this.state.ticketStatsData.student.notStudent]);

			var ticketStudentOptions = {
				distributeSeries: true,
				axisY: {
					onlyInteger: true,
					divisor: 5,
				},
				axisX: {
					showGrid: false
				},
			};

			ticketStudentChart = (
				<ChartistGraph data={ticketStudentData} type={'Bar'} options={ticketStudentOptions} className="ct-major-sixth student" />
			);
		}

		var cashSalesByHour;
		if (!this.state.isLoadingTicketStats && typeof(this.state.ticketStatsData.cashHour) != "undefined" && this.state.ticketStatsData.cashHour.length > 0) {
			var cashHourLabels = [];
			var cashHourSeries = []
			for (var i = 0; i < this.state.ticketStatsData.cashHour.length; i++) { 
				cashHourLabels.push(this._getPrettyHour(this.state.ticketStatsData.cashHour[i].hour));
				cashHourSeries.push(parseInt(this.state.ticketStatsData.cashHour[i].sales));
			}

			var cashHourData = {
				labels: cashHourLabels,
				series: [cashHourSeries]
			};

			var cashHourOptions = {
				low: 0,
				showArea: true,
				axisY: {
					onlyInteger: true
				},
				axisX: {
					showGrid: false
				},
				lineSmooth: false
			};

			cashSalesByHour = (
				<ChartistGraph data={cashHourData} type={'Line'} options={cashHourOptions} className="ct-major-sixth overview"/>
			);
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Overview</h2>

								<div className="row overview-charts">
									<div className="col-md-3">
										<h3>Total Sales</h3>
										{ticketTotalsChart}
										<h4>{ticketSalesTotal}</h4>
										<h5>of {ticketSalesAvailable}</h5>
									</div>
									<div className="col-md-9">
										<h3>Ticket Sales Over Time</h3>
										<div className="form form-inline options">
											<div className="form-group">
												show by
												<div className="radio">
													<label>
														<input type="radio" name="ticketSalesGrouping" value="days" checked={this.state.ticketSalesGrouping == "days"} onChange={this.handleTicketSalesGroupingChange}/> days
													</label>
												</div>
												<div className="radio">
													<label>
														<input type="radio" name="ticketSalesGrouping" value="weeks" checked={this.state.ticketSalesGrouping == "weeks"} onChange={this.handleTicketSalesGroupingChange}/> weeks
													</label>
												</div>
											</div>
										</div>
										{ticketSalesChart}
									</div>
								</div>
								<div className="row overview-charts">
									<div className="col-md-6">
										<h3>Student vs Non-Student Sales</h3>
										{ticketStudentChart}
									</div>
									<div className="col-md-6">
										<h3>Cash Sales by Time of Day</h3>
										{cashSalesByHour}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);

	},

	_getPrettyHour: function(hourDigit) {

		return (hourDigit > 12 ? hourDigit - 12 : hourDigit) + ":00";

	}

});

module.exports = Overview;