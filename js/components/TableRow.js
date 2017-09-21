var React = require('react');
var classNames = require('classnames');

var TableRow = React.createClass({

    getInitialState: function() {
        return {};
    },

    render: function() {

        var row = this.props.row;
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        var seats = [];
        var seatNumbers = [];
        var seatNumbersCount = 0;
        var seatNumbersNoSeatCount = 0;
        for (var i = 0; i < this.props.numColumns; i++) {

            if (this.props.columnSplits.indexOf(alphabet.charAt(i)) >= 0) {
                seats.push(<td className="separator"></td>);
            }

            if (this.props.columnSplits.indexOf(alphabet.charAt(i)) >= 0 || i == this.props.numColumns - 1) {

                if (seatNumbersCount > 0)
                    seatNumbers.push(<td colSpan={seatNumbersCount} className="seat-count">{seatNumbersCount} Seats</td>);

                seatNumbers.push(<td className="separator" colSpan={seatNumbersNoSeatCount + 1}></td>);

                seatNumbersNoSeatCount = 0;
                seatNumbersCount = 0;
            }

            var foundSeat = false;
            for (var x = 0; x < row.seats.length; x++) {

                if (row.seats[x].name == alphabet.charAt(i)) {
                    foundSeat = true;

                    var label = "";
                    var classes = ["seat"];
                    if (row.seats[x].ticket) {
                        classes.push("taken");
                        label = row.seats[x].ticket.firstName + " " + row.seats[x].ticket.lastName;
                    }
                    else {
                        classes.push("available");
                    }

                    seats.push(<td className={classNames(classes)}>{label}</td>);
                    seatNumbersCount++;
                    break;
                }

            }

            if (!foundSeat) {
                seats.push(<td className="no-seat"></td>);
                seatNumbersNoSeatCount++;
            }

        }

        return (
            <tbody>
                <tr>
                    <td rowSpan="2">{row.name}</td>
                    {seats}
                    <td rowSpan="2">{row.name}</td>
                </tr>
                <tr>
                    {seatNumbers}
                </tr>
            </tbody>
        );


    }
});

module.exports = TableRow;
