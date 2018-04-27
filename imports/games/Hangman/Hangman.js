import "./Hangman.html";
import { wordBank } from "./HangmanWords.js";
/* hangman */

Template.gameHangman.onCreated(function gameOnCreated() {
  var rand = Math.floor(Math.random() * wordBank.length);

  /* add pulling word from a dict */
  this.completeWord = new ReactiveVar(wordBank[rand]);

  //generate string of "_"'s
  var blanks = "";
  for (var i = 0; i < this.completeWord.get().length; i++) {
    blanks += "_ ";
  }

  this.word = new ReactiveVar(blanks);
  this.numGuesses = new ReactiveVar(5);
  this.winText = new ReactiveVar("");
  this.prompt = new ReactiveVar("Word");
  this.done = new ReactiveVar(false);
});

Template.gameHangman.helpers({
  numGuesses() {
    return Template.instance().numGuesses.get();
  },

  word() {
    return Template.instance().word.get();
  },

  completeWord() {
    return Template.instance().completeWord.get();
  },

  winText() {
    return Template.instance().winText.get();
  },

  done() {
    return Template.instance().done.get();
  },

  prompt() {
    return Template.instance().prompt.get();
  },

  guess() {
    if (Template.instance().numGuesses.get() == 1) {
      return "guess";
    } else {
      return "guesses";
    }
  }
});

Template.gameHangman.events({
  "click .btn-back": function() {
    Session.set("currentView", "gameSelect");
    Session.set("docTitle", "Phone Games");
  },

  "click button"(event, instance) {
    if (instance.numGuesses.get() == 0 || instance.done.get() || event.target.innerText == "BACK") {
      return;
    }

    var letter = event.target.innerText;
    /* if button is not opaque -> clicked */
    if (document.getElementById(event.target.innerText).style.opacity != 0.5) {
      /* make button opaque to indicate it is unable to be clicked again */
      document.getElementById(letter).style.opacity = 0.5;

      var word = instance.completeWord.get();

      /* if guessed letter is not in the word */
      if (word.indexOf(letter) == -1) {
        if (instance.numGuesses.get() > 0) {
          instance.numGuesses.set(instance.numGuesses.get() - 1);
        }
        if (instance.numGuesses.get() == 0) {
          instance.winText.set("You Lost :(");
          instance.done.set(true);
          instance.prompt.set("The word was");
        }
      } else {
        /* if it is in the word */
        var newBlanks = "";
        for (var i = 0; i < word.length; i++) {
          if (word.charAt(i) == letter) {
            newBlanks += letter + " ";
          } else {
            newBlanks += instance.word.get().charAt(i * 2) + " ";
          }
        }
        instance.word.set(newBlanks);

        //check if any blanks remain
        if (newBlanks.indexOf("_") == -1) {
          instance.winText.set("You Win!");
          instance.done.set(true);
        }
      }
    }
  }
});
