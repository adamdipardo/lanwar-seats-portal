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
        for (var i = 0; i < this.props.numColumns; i++) {

            if (this.props.columnSplits.indexOf(alphabet.charAt(i)) >= 0)
                seats.push(<td className="separator"></td>);

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
                    break;
                }

            }

            if (!foundSeat) {
                seats.push(<td className="no-seat"></td>);
            }

        }

        return (
            <tr>
                <td>{row.name}</td>
                {seats}
                <td>{row.name}</td>
            </tr>
        );


    }
});

module.exports = TableRow;
