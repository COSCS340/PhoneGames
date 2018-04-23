import { Random } from "meteor/random";
import { locations } from "./SpyfallLocations.js";

Meteor.methods({
  makeSpyfall: function(pls) {
    let local = pickLocation();
    let roles = local.roles;

    pls.forEach(function(player, index, pls) {
      pls[index] = Object.assign(
        {
          role: roles.splice(Math.floor(Math.random() * roles.length), 1)[0]
        },
        player
      );
    });
    pls[Math.floor(Math.random() * pls.length)].role = "Spy";
    SpyfallGames.insert({
      players: pls,
      location: local.name,
      endTime: new Date().getTime() + 10 * 60 * 1000
    });
  },
  getRole: function() {
    let game = SpyfallGames.findOne({ "players.userId": this.userId });
    let userId = this.userId;
    return game.players.find(function(player) {
      return (player.userId == userId);
    }).role;
  },
  getLocation: function() {
    let game = SpyfallGames.findOne({ "players.userId": this.userId });
    return game.location;
  }
});

function pickLocation() {
  return locations[Math.floor(Math.random() * locations.length)];
}
