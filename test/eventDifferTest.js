var eventDiffer = require('../lib/eventDiffer');
var eventType   = require('../lib/eventType');
var assert      = require('assert');

describe('eventDiffer', function () {
    it('fails if events include an unknown event type', function () {
        var events = [
            {type: eventType.featureCreated, data: {}},
            {type: 'unknown-type', data: {}}
        ];

        assert.throws(function () {
            eventDiffer.addDiffs(events);
        });
    });

    it('diffs a feature-update event', function () {
        var name = 'foo';
        var desc = 'bar';

        var events = [
            {
                type: eventType.featureUpdated,
                data: {name: name, description: desc, strategy: 'default', enabled: true, parameters: {value: 2 }}
            },
            {
                type: eventType.featureCreated,
                data: {name: name, description: desc, strategy: 'default', enabled: false, parameters: {value: 1}}
            }
        ];

        eventDiffer.addDiffs(events);

        assert.deepEqual(events[0].diffs, [
            {kind: 'E', path: ["enabled"], lhs: false, rhs: true},
            {kind: 'E', path: ["parameters", "value"], lhs: 1, rhs: 2}
        ]);

        assert.equal(events[1].diffs, undefined);
    });

    it('diffs only against features with the same name', function () {
        var events = [
            {
                type: eventType.featureUpdated,
                data: {name: 'bar', description: 'desc', strategy: 'default', enabled: true, parameters: {}}
            },
            {
                type: eventType.featureUpdated,
                data: {name: 'foo', description: 'desc', strategy: 'default', enabled: false, parameters: {}}
            },
            {
                type: eventType.featureCreated,
                data: {name: 'bar', description: 'desc', strategy: 'default', enabled: false, parameters: {}}
            },
            {
                type: eventType.featureCreated,
                data: {name: 'foo', description: 'desc', strategy: 'default', enabled: true, parameters: {}}
            }
        ];

        eventDiffer.addDiffs(events);

        assert.equal(events[0].diffs[0].rhs, true);
        assert.equal(events[1].diffs[0].rhs, false);
        assert.equal(events[2].diffs, undefined);
        assert.equal(events[3].diffs, undefined);
    });
});