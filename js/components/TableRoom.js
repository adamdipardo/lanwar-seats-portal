var React = require('react');

var TableRow = require('./TableRow');

var TableRoom = React.createClass({

    getInitialState: function() {
        return {};
    },

    render: function() {

        var room = this.props.room;
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        var columnSplits = [];
        if (room.name == 'UA 1350') {
            columnSplits.push('E');
            columnSplits.push('R');
        }

        // figure out highest number of seats for this room
        var numColumns = 0;
        for (var i = 0; i < room.rows.length; i++) {
            if (room.rows[i].seats.length > numColumns)
                numColumns = room.rows[i].seats.length;
        }

        // reverse rows
        room.rows = room.rows.reverse();

        var rows = [];
        for (var i = 0; i < room.rows.length; i++) {
            rows.push(<TableRow key={i} row={room.rows[i]} columnSplits={columnSplits} numColumns={numColumns}/>);
        }

        // generate heading
        var letterHeading = [<td></td>];
        for (var i = 0; i < numColumns; i++) {

            if (columnSplits.indexOf(alphabet.charAt(i)) >= 0)
                letterHeading.push(<td className="separator"></td>);

            letterHeading.push(<td>{alphabet.charAt(i)}</td>);
        }
        letterHeading.push(<td></td>);

        return (
            <div>
                <h2>Room {room.name}</h2>

                <table className="table-room">
                    <thead>
                        <tr>
                            {letterHeading}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                    <tfoot>
                        <tr>
                            {letterHeading}
                        </tr>
                    </tfoot>
                </table>
            </div>
        );

    }

});

module.exports = TableRoom;
