angular.module('player',['match'])
  .factory('playerImageService', ['matchService',function(matchService) {

			return {
				getPlayerImage:getPlayerImage
			};
			
			function stripVowelAccent(str)
			{
				var rExps=[
					{re:/[\xC0-\xC6]/g, ch:'A'},
					{re:/[\xE0-\xE6]/g, ch:'a'},
					{re:/[\xC8-\xCB]/g, ch:'E'},
					{re:/[\xE8-\xEB]/g, ch:'e'},
					{re:/[\xCC-\xCF]/g, ch:'I'},
					{re:/[\xEC-\xEF]/g, ch:'i'},
					{re:/[\xD2-\xD6]/g, ch:'O'},
					{re:/[\xF2-\xF6]/g, ch:'o'},
					{re:/[\xD9-\xDC]/g, ch:'U'},
					{re:/[\xF9-\xFC]/g, ch:'u'},
					{re:/[\xD1]/g, ch:'N'},
					{re:/[\xF1]/g, ch:'n'} ];

				for(var i=0, len=rExps.length; i<len; i++) {
					str=str.replace(rExps[i].re, rExps[i].ch);
				}
				return str;
			}
	
			function getPlayerImage (player_id) {
				var player = matchService.getPlayerById(player_id);
				var firstLetter = stripVowelAccent(player.getName().substring(0,1).toLowerCase());
				var slug = stripVowelAccent(player.getName().toLowerCase().replace(/ /g,"-"));
				if (player_id.indexOf("p") == 0) {
					player_id = player_id.substring(1,player_id.length);
				}
				if (slug === 'jon-flanagan') {
					slug ='john-flanagan';
				}
				if (slug === 'cheick-tiote') {
					slug ='cheik-tiote';
				}
				if (slug === 'luis-antonio-valencia') {
					slug ='antonio-valencia';
					firstLetter = 'a';
				}
				if (slug === 'adnan-januzaj') {
					slug ='adnan-januzaj-2';
				}
				if (slug === 'ashley-williams') {
					slug ='ashley-williams-2';
				}
				if (slug === 'ben-davies') {
					slug ='ben-davies-2';
				}
				return 'http://www.premierleague.com/content/dam/premierleague/shared-images/players/'
					+ firstLetter+'/'+slug+'/'+player_id+'-lsh.jpg';
			 }
 }]);