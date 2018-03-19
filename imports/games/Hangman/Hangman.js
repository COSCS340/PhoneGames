//import { Random } from 'meteor/random'
import './Hangman.html';

/* hangman */

Template.gameHangman.onCreated(function gameOnCreated() {

  this.completeWord = new ReactiveVar("PEPPER");

  //generate string of "_"'s
  var i = 0;
  var blanks = "";
  for (; i < this.completeWord.get().length; i++){
    blanks += "_ "
  }

  this.word = new ReactiveVar(blanks);
  this.numGuesses = new ReactiveVar(5);
  this.winText = new ReactiveVar("");
  this.won = new ReactiveVar(false);
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
  
  'click .btn-back': function() {
		Session.set("currentView", "gameSelect");
		Session.set("whatGame", "none");
		return;
  },
  
  //when any button is clicked
  'click button'(event, instance) {
	if (instance.numGuesses.get() == 0 || instance.won.get() == true) {
		return;
	}
  
    var letter = event.target.innerText;

    //if button hasn't already been clicked
    if (letter != ""){
      //set button to clicked
      event.target.innerText = "";
//	  document.getElementById(event.target.innerText).style.textIndent = "-99999px";

      var word = instance.completeWord.get();

      //if string does not contain letter
      if (word.indexOf(letter) == -1){
		if (instance.numGuesses.get() > 0) {
			instance.numGuesses.set(instance.numGuesses.get()-1);
		}
		if (instance.numGuesses.get() == 0) {
			instance.winText.set("You Lost :(");
			instance.done.set(true);
			instance.prompt.set("The word was");
		}
      }
      //String does contain letter
      else{
        var i = 0;
        var newBlanks = "";
        for (; i < word.length; i++){
          if (word.charAt(i) == letter){
            newBlanks += letter + " ";
          }
          else{
            newBlanks += instance.word.get().charAt(i*2) + " ";
          }
        }
        instance.word.set(newBlanks);

        //check if any blanks remain
        if (newBlanks.indexOf("_") == -1){
          instance.winText.set("You Win!");
		  instance.won.set(true);
		  instance.done.set(true);
		}
      }

    }
  },
});