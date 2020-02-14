const assert = require('assert');
const ShowDetails = require('../index.js')
const show = new ShowDetails()

describe('compare show details', function() {
  it('should calculate series duration in seconds', async function() {
	var details = await show.getShowData()

    assert.equal(details.totalDurationSec, '88140');
  });
  it('should calculate average episodes per season', async function() {
	var details = await show.getShowData()

    assert.equal(details.averageEpisodesPerSeason, '8.3');
  });
  it('should have all episodes from seasons 1 - 3', async function() {
	var details = await show.getShowData()
	var total_episodes = Object.keys(details.episodes)

    assert.equal(total_episodes.length, '25');
  });
});

describe('compare episode details', function() {
	it('should have s1e1 format', async function() {
	  var details = await show.getShowData()
	  var episodes_keys = Object.keys(details.episodes)

      assert.equal(details.episodes[episodes_keys[0]].sequenceNumber, 's1e1');
	  assert.equal(details.episodes[episodes_keys[1]].sequenceNumber, 's1e2');
	  assert.equal(details.episodes[episodes_keys[episodes_keys.length - 1]].sequenceNumber, 's3e8');
    });
	it('should NOT have Chapter X: prefix', async function() {
	  var prefix_removed = false
	  var details = await show.getShowData()
  	  var episodes_keys = Object.keys(details.episodes)
	  var random_id = Math.floor(Math.random() * episodes_keys.length) + 1

	  if(!details.episodes[episodes_keys[random_id]].shortTitle.includes('Chapter') &&
  		 !details.episodes[episodes_keys[random_id]].shortTitle.includes(':')) {
		 prefix_removed = true
	  }

      assert.equal(prefix_removed, true);
    });
	it('should have epoch time stamp', async function() {
	  var has_epoch_timestamp = false
	  var details = await show.getShowData()
  	  var episodes_keys = Object.keys(details.episodes)
	  var random_id = Math.floor(Math.random() * episodes_keys.length) + 1

	  if(!isNaN(details.episodes[episodes_keys[random_id]].airTimeStamp) &&
  		 details.episodes[episodes_keys[random_id]].airTimeStamp > 100000) {
		 has_epoch_timestamp = true
	  }

      assert.equal(has_epoch_timestamp, true);
    });
	it('should have one sentence summary', async function() {
	  var summary_contains_carrots = true
	  var one_period_ending_sentence = false
	  var details = await show.getShowData()
  	  var episodes_keys = Object.keys(details.episodes)
	  var random_id = Math.floor(Math.random() * episodes_keys.length) + 1
	  var period_index = details.episodes[episodes_keys[random_id]].shortSummary.indexOf('.')

	  if(!details.episodes[episodes_keys[random_id]].shortSummary.includes('<') &&
	  	 !details.episodes[episodes_keys[random_id]].shortSummary.includes('>')) {
		 summary_contains_carrots = false
	  }

	  if((period_index == details.episodes[episodes_keys[random_id]].shortSummary.length - 1)) {
		  one_period_ending_sentence = true
	  }

      assert.equal(summary_contains_carrots, false);
	  assert.equal(one_period_ending_sentence, true);
    });
});
