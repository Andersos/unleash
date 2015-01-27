var React = require('react');

var DIFF_PREFIXES = {
    A: ' ',
    E: ' ',
    D: '-',
    N: '+'
}

var SPADEN_CLASS = {
    A: 'blue', // array edited
    E: 'blue', // edited
    D: 'negative', // deleted
    N: 'positive', // added
}

var LogEntry = React.createClass({
    propTypes: {
        event: React.PropTypes.object.isRequired
    },

    render: function() {
        var d = new Date(this.props.event.createdAt);

        return (
            <tr>
                <td>
                    {d.getDate() + "." + d.getMonth() + 1 + "." + d.getFullYear()}<br />
                    kl. {d.getHours() + "." + d.getMinutes()}
                </td>
                <td>
                    <strong>{this.props.event.data.name}</strong><em>[{this.props.event.type}]</em>
                </td>
                <td style={{maxWidth: 300}}>
                    {false ? this.renderFullEventData() : this.renderEventDiff()}
                </td>
                <td>{this.props.event.createdBy}</td>
            </tr>
        );
    },

    renderFullEventData: function() {
        var localEventData = JSON.parse(JSON.stringify(this.props.event.data));
        delete localEventData.description;
        delete localEventData.name;

        var prettyPrinted = JSON.stringify(localEventData, null, 2);

        return (<code className='JSON smalltext man'>{prettyPrinted}</code>)
    },

    renderEventDiff: function() {
        if (this.props.event.diffs) {
            var changes = this.props.event.diffs.map(function(diff) {
                var spadenClass = SPADEN_CLASS[diff.kind]
                var prefix      = DIFF_PREFIXES[diff.kind];
                var parts       = [];
                var key         = diff.path.join('.');

                if (diff.lhs) { parts.push(diff.lhs) };
                if (diff.rhs) { parts.push(diff.rhs) };

                var change = parts.length === 2 ? parts.join(' => ') : parts.join(' ');

                return (<div className={spadenClass}>{prefix} {key}: {change}</div>)
            });

            return (<code className='smalltext man'>{changes}</code>)
        } else {
            return this.renderFullEventData();
        }
    }

});

module.exports = LogEntry;