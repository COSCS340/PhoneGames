export var msgCodes = {
  tooMany: "Too many players",
  tooFew: "Too few players"
};

export var errCodes = {
  invalidLobbyCode: "That lobby code is invalid.",
  notLoggedIn: "You must be logged in to create a game.",
  fullLobby: "That lobby is already full.",
  userTaken: "That username is already taken.",
  nameTooShort: "Names must be longer than 0 characters.",
  nameTooLong: "Names must be shorter than 15 characters.",
  lobbyIdLen: "Lobby IDs must be exactly 4 characters long."
};

export var minimumPlayers = {
  "Tic-Tac-Toe": 2,
  Celebrity: 4,
  Spyfall: 3,
};

export var maximumPlayers = {
  "Tic-Tac-Toe": 2,
  Celebrity: 16,
  Spyfall: 8,
};
