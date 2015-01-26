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
                data: {name: name, description: desc, strategy: 'default', enabled: true, parameters: {}}
            },
            {
                type: eventType.featureCreated,
                data: {name: name, description: desc, strategy: 'default', enabled: false, parameters: {}}
            }
        ];

        eventDiffer.addDiffs(events); 

        assert.deepEqual(events[0].diffs, [
            {kind: 'E', path: ["enabled"], lhs: true, rhs: false}
        ]);

        assert.equal(events[1].diffs, undefined);
    });

    it('diffs only against features with the same name');
});