# PhoneGames - **Party Game Dev Squad**
- Team Number 8  
  - Jerry Duncan
  - Preston Provins
  - Cameron O’Neil
  - Howard Choi

## Introduction
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At the time of our demo (March 21st) we had the following
features implemented: a login system, two working games, and a user friendly website. All of which were deployed to our website using
Google Cloud’s app engine and virtual machine servers. The login system allows every user that visits our site to create an account
using any unique username and password they desire. In order to keep track of everyone as they play, we require that every user has an
account before exploring what games we have to offer. The reason we do this is to simplify bookkeeping on our end and to ensure that our
users will have a better overall experience. The two games we demoed were hangman and tic-tac-toe, both used to showcase our website’s
interactivity and demonstrate the groundwork we’ve performed thus far.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As for changes to our project, we’ve had to switch CSS
stylesheets multiple times because our mobile UI/UX is lacking severely compared to other modern websites and we’re still not satisfied
with our website’s design. Also, many of the early packages we tried using for the accounts system lacked the functionality that we
needed so we had to take an existing one and expand it to meet our requirements. And we were originally going to host our app on
DigitalOcean, but due to some unfortunate circumstances, our hosting credit disappeared and we had to port the entire project to Google
Cloud instead.

## Customer Value
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Over the course of the project, our customer value section
hasn’t been effected. Despite the changes we made to our requirements and overall design that was noted in the introduction, they have
had no effect on whom we perceive to be our target audience or what our final solution will deliver to our intended audience.

## Technology
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The main components of our project are Meteor, its
subcomponents, and Google Cloud. Meteor is a JavaScript web framework that we used to create our website while Google Cloud was used to
host our project so that everyone on the web can access it. In Meteor lies MongoDB which is a database package that allows us to store
and share data between clients and the server so that we can easily keep track of accounts, games, and in the future, lobbies. Due to
the nature of our project being a webapp, we use Google Cloud's App Engine to store the user-facing side of things while a virtual
machine interfaces with the app engine to run server-side methods and store information in a database.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Our major goals for this iteration were to create the a
barebones website, a login system to keep track of users, and to implement a few simple games to utilize that login system’s
functionality.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At the time of our demo, we had a working homepage, game
selection screen, account / login system, and two games (hangman and tic-tac-toe).
![Game Selection](https://i.imgur.com/D3xE16G.png)
![Hangman](https://i.imgur.com/h4gtX3V.png)
![TicTacToe](https://i.imgur.com/8JnqmJZ.png)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;So far we've created unit tests that test different parts of our site to check for various errors such as accessing undefined objects, returning the wrong data types, and disconnected UI components.
For the next iteration we plan on doing more penetration testing because our users information may still be insecure and accessible by
other users who shouldn't be able to see it.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For the next iteration, we plan to have lobbies implemented so
that we can start working on adding multiplayer to our existing games and have an easier time implementing our main games. Also, we hope
to have our chat lobby up and running before our next release.

## Team
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When we first started the project we divided the work into 2
main groups: game development and website development. Jerry and Preston both worked on the website side of the project while Michael
and Howard worked on game development. As time went on, Jerry’s role evolved to handle the login system, the website experience, and
integrating the basic games we had into the site. Preston also moved from front-end development to deploying the website and ensure that
all of the packages and databases we used would work with Google Cloud.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As we move forward, everyone’s role will slowly evolve as we get
closer to the final deadline and finish creating and implementing our main games. Jerry will make sure that newly created games are
integrated seamlessly with the site and perform QA testing to ensure our users’ experience is bug-free. Preston will continue to work on
a site-wide chat system and then move to performing penetration tests to make sure our users’ data is secure. Michael will be in charge
of creating and playtesting our main games, refining the rules and visuals to keep users coming back. And lastly, Howard will shift his
focus creating a more intuitive and appealing website by redesigning most of the its UI, layout, and overall experience.

## Project Management
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As of the time of submitting our status report, our project is
on schedule and will be ready to present by the end of next month. All of the large hurdles we had to get over such as the login system
and lobbies have been fully implemented and all that’s left to do is to finish implementing our primary games and redesign the UI.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Since the start of the semester, we have had to push many
features back by a few weeks because there was an initial learning curve that we didn’t predict. Because of that, the initial schedule
we outlined in our initial proposal and through github’s issue tracker had to be pushed back by two weeks. Despite that setback, we’ve
managed to catch up to our original schedule through hard work and we are on track to complete our project in the next three weeks like
originally planned.

## Reflection
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Because each of us had structured roles, our experiences of what went well and what didn't are very different from each others' and because of that, we've included every person's experience.
- Preston
  - Creating the server, managing our packages, and handling the dockerfile and app.yaml all went smoothly. 
  - However, I ran into some trouble with Google’s app development platform because it was hard to get it to deploy and function properly using Meteor. Then I ran into more problems when I tried to create an instance of our site in a virtual machine that had MongoDB functionality. 
  - In the next iteration, I'll be trying to find a different hosting platform with better support for what we need that doesn't require hours of fiddling to make work correctly.
- Jerry
  - Implementing user accounts, logging in, and the barebones of our website went without a hitch.
  - However, removing all of the bugs I created in the site's user interface has been very challenging because I had already moved on to creating new features and was unfamiliar with the code I had written previously.
  - In the future, I'll make the UI alongside implementing new features because planning ahead will prevent the subtle bugs that I struggled to squash when making the UI for old features.
- Michael
  - Writing game logic and coming up with new game ideas was a breeze
  - Although that part was easy, creating the graphics for each game was hard to do because of my lack of experience with HTML and CSS. Also, converting games from single player implementations to multiplayer ones proved to be much harder than anticipated.
  - For the next iteration, I think that writing a generic multiplayer module will allow me to start with a basic set of graphics and multiplayer functionality regardless of what game I'm creating so that I can go from design and implementation to usable much more quickly.
- Howard
  - Writing game logic and the UI for my games went well and looks good
  - While it's a lot easier now, initially I struggled a lot with JavaScript and templating - it was new to me. It took a while to get up to speed and I'm still unsure of how to put multiplayer into my games.
  - Before our next release, I plan on going through more JavaScript tutorials and working through our code base so that I can hopefully implement multiplayer in my games without the issues Michael has faced when implementing multiplayer in his games.
