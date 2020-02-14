const axios = require('axios')
const STRANGER_THINGS_API = 'http://api.tvmaze.com/singlesearch/shows?q=stranger-things&amp;embed=episodes'

class ShowDetails {
	constructor() {
		this.series = {}
	}

	async getShowData() {
		var series_data = await axios.get(STRANGER_THINGS_API)
		var show_id = series_data.data.id
		var episodes = await axios.get(`${series_data.data._links.self.href}/episodes`)

		episodes.data.pop()

		let episodes_details = this.aggregateEpisodesData(episodes.data)

		this.series[show_id] = {}
		this.series[show_id].totalDurationSec = episodes_details.totalDurationSec
		this.series[show_id].averageEpisodesPerSeason = episodes_details.averageEpisodesPerSeason
		this.series[show_id].episodes = episodes_details.episodes

		return this.series[show_id]
	}

	aggregateEpisodesData(episodes_list) {
		var totalDurationSec = 0
		var episodes = {}

		for(let i = 0; i < episodes_list.length; i++) {
			let episode = episodes_list[i]
			episodes[episode.id] = {}
			episodes[episode.id].sequenceNumber = `s${episode.season}e${episode.number}`
			episodes[episode.id].shortTitle = this.removePrefix(episode.name)
			episodes[episode.id].airTimeStamp = Date.parse(episode.airstamp)
			episodes[episode.id].shortSummary = this.firstSentenceOf(episode.summary)

			totalDurationSec += episode.runtime * 60
		}

		return {
			totalDurationSec,
			averageEpisodesPerSeason: (episodes_list.length / episodes_list[episodes_list.length - 1].season).toFixed(1),
			episodes
		}

	}

	removePrefix(title) {
		let title_split = title.split(':')
		return title_split[1]
	}

	firstSentenceOf(summary) {
		let summary_split = summary.split('.')
		let first_sentence = summary_split[0]

		if(first_sentence.includes('Dr') || first_sentence.includes('Mr') || first_sentence.includes('Mrs')) {
			first_sentence += '.'
			first_sentence += summary_split[1]
		}

		if(first_sentence.includes('<') || first_sentence.includes('>')) {
			first_sentence = first_sentence.replace(/<.*>/, '')
		}
		first_sentence += '.'

		return first_sentence
	}

}

module.exports = ShowDetails;
