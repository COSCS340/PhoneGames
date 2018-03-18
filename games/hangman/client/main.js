import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';



Template.game.onCreated(function gameOnCreated() {

  this.completeWord = new ReactiveVar("PEPPER");

  //generate string of "_"'s
  var i = 0;
  var blanks = "";
  for (; i < this.completeWord.get().length; i++){
    blanks += "_ "
  }

  this.word = new ReactiveVar(blanks);
  this.guesses = new ReactiveVar(5);
  this.winText = new ReactiveVar("");
});

Template.game.helpers({
  guesses() {
    return Template.instance().guesses.get();
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
});

Template.game.events({
  //when any button is clicked
  'click button'(event, instance) {

    var letter = event.target.innerText;

    console.log("-" + letter + "-");

    //if button hasn't already been clicked
    if (letter != ""){
      //set button to clicked
      event.target.innerText = " ";

      var word = instance.completeWord.get();

      //if string does not contain letter
      if (word.indexOf(letter) == -1){
        instance.guesses.set(instance.guesses.get()-1);
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
        }
      }




    }
  },
});
