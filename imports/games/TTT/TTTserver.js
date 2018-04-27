Meteor.methods({
  makeTTT: function(p1ID, p2ID) {
    TTT.insert({
      player1: p1ID, //X
      player2: p2ID, //O
      turn: p1ID,
      board: "---------",
      win: 0
    });
    return TTT.findOne({
      player1: p1ID
    })._id;
  },
  makeMove: function(gameID, userID, cell) {
    var game = TTT.findOne({
      $or: [
        {
          player1: Meteor.userId()
        },
        {
          player2: Meteor.userId()
        }
      ]
    });

    if (!game || game.win > 0) {
      return;
    }

    if (game.turn === userID) {
      var brd = game.board;

      if (brd[cell] != "-") return;

      var otherPlayer;
      if (userID === game.player1) {
        brd = setCharAt(brd, cell, "X");
        otherPlayer = game.player2;
      } else {
        brd = setCharAt(brd, cell, "O");
        otherPlayer = game.player1;
      }

      var win = 0;
      if (checkWin(brd)) {
        if (game.turn == game.player1) {
          win = 1;
        } else {
          win = 2;
        }
      }
      //update board and turn
      TTT.update(
        {
          $or: [
            {
              player1: Meteor.userId()
            },
            {
              player2: Meteor.userId()
            }
          ]
        },
        {
          $set: {
            board: brd,
            turn: otherPlayer,
            win: win
          }
        }
      );
    }
  }
});

function checkWin(board) {
  //check rows
  for (var i = 0; i < 9; i += 3)
    if (
      board[i + 0] != "-" &&
      board[i + 0] == board[i + 1] &&
      board[i + 1] == board[i + 2]
    ) {
      return true;
    }
  //check cols
  for (var i = 0; i < 3; i++)
    if (
      board[i + 0] != "-" &&
      board[i + 0] == board[i + 3] &&
      board[i + 3] == board[i + 6]
    ) {
      return true;
    }
  //check diagonals
  if (board[0] != "-" && board[0] == board[4] && board[4] == board[8]) {
    return true;
  }
  if (board[2] != "-" && board[2] == board[4] && board[4] == board[6]) {
    return true;
  }

  return false;
}

function setCharAt(str, index, chr) {
  return str.substr(0, index) + chr + str.substr(Number(index) + 1);
}
