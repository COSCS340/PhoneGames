## Heading

### PhoneGames - **Party Game Dev Squad**
- Team Number 8  
  - Jerry Duncan
  - Preston Provins
  - Michael O’Neil
  - Howard Choi

## Introduction

- What is your project?
  - For our project, we built a browser based client-server game-system that allows us to implement a wide variety of party games for our users to play. We converted many physical party games to digital versions that allow our users to play with each other in real-time.
- What is your motivation for your project?
  - Our motivation for this project is that we're avid gamers who enjoy playing party games, but having to carry around physical games can become tiresome. At the same time, there is a severe lack of digital party games on the market, so we decided to create a platform that allowed us to convert our favorite physical games to digital ones that we can take anywhere we go.
- Briefly describe your approach
  - We didn't want to spend too much time on setting up the core client-server code, and instead wanted to focus on creating interesting, feature rich games so we went looking for a fullstack framework that would help us out. We found and used a framework called Meteor to give us a client-server foundation that we built our website and games on.
- If there were major changes to requirements, design, or development plans in your project life cycle, discuss them here
  - Our final product has all the main features that we set out to implement in the beginning. Although the product is not as feature rich as originally intended, we have laid very useful groundwork we and other developers can use to aid in implementing more games. We stretched ourselves a little too far with the idea of making our own, original game, but we were able to incorporate already designed games to still make a fun and usable product.
- Summarize your results and conclusions. Did you complete your project goals?
  - While we were unable to complete all of the quality of life improvements we had hoped to make in time for the presentation deadline, we still managed to deliver a product that incorporated all of the main goals that we set out to accomplish at the beginning of the semester.
  
## Customer Value

- Over the course of the project, our customer value section hasn’t been effected at all. Despite the small goals we were unable to complete that were briefly mentioned in the introduction, they have had no effect on whom we perceive to be our target audience or what our final solution will deliver to that intended audience. All of the quality of life features that we had hoped to complete were nice additions to our product, but they don't detract from the value we provide our intended customers and why we have determined that no change has occurred from our initial customer value section.

## Technology

- **todo**

## Team

- **What role did team members have through the project?**
  - At the beginning of the semester we all chose roles that we thought we would focus on.
  - Our starting roles:
	  - Jerry - Accounts, merging games into website, website layout & UI, and project manager
	  - Preston - Deployment (gcloud, docker)
	  - Michael - Game Development
	  - Howard - Game Development
  - **Did all members contribute equally? Or was there one or two members who led the project?**
    - Jerry led the project and doled out tasks and made sure everyone was working on what they were supposed to.
- **Did team member roles change or were they mostly static?**
  - About a week before the status report was due, we figured out that everyone was not great at parts of their role and we needed to switch them up
  - Our roles from the status report until the end:
    - Jerry - Lobbies, merging games into website, making sure everything worked, secondary game dev, and project manager
    - Preston - Deployment, lobby chat, and the presentation slides
    - Michael - Main game dev
    - Howard - Website UI/UX
- Jerry led the development of the project in code and design. Most members worked in the roughly the same role from the beginning of the project to the end. Jerry always worked on some component of the core functionality for every sprint. Preston was busy with implementing chat box functionality and getting our site deployed and hosted on Google Cloud. Michael was tasked with developing most of our games except for Celebrity. Howard worked improving the UI.

## Project Management

- Did you complete all of your goals for the product on schedule?
  - While we did finish the vast majority of our goals, we did manage to complete all of them. Our main objective was to create a website to host multiplayer board games that:
    - Did not require the user to have to run their own servers
    - Did not require purchase of any additional product
    - Worked on both computers and mobile devices
    - Required no additional downloads (such as apps)
    - Implemented a global and lobby chat system
    - Deployed on Gcloud
  - We were able to accomplish all of our main goals, but unfortunately there were also some objectives that we were unable to complete before the presentation deadline. Our biggest disappointment was that we were unable to complete our complete UI overhaul that would have made the site look much nicer, more intuitive, and work seamlessly on mobile. While trying to merge our new UI, it broke too many parts on our website so we had to revert back to our old UI right before our presentation. 
  - The next thing we had hoped to accomplish was adding more games. The hardest part about creating a game was trying to figure out how to deal with sending data between the server and client using MongoDB and making sure that it worked with our lobby system. Once we figured out how to do that, adding new games was very simple. Unfortunately, by the time we got to that point, we had to shift our focus towards the UI overhaul due to time constraints.
  - There were also a few minor improvements we didn’t manage to complete either, such as instruction screens, leaderboards, and a friend system.
  - Overall, the number one reason we didn’t get to implement every feature we had hoped to was because of poor time management. None of our objectives were too challenging to implement, they just required too much time so we cut out the less essential features and presented with what we had.

  - Our completed goals:
    - Game service does not require any user run servers or additional hardware
    - No downloads (apps) are required
    - Account creation and anonymous login 
    - Chat system
    - Compatibility with both phones and computers
  - Our incomplete goals:
    - UI overhaul
    - More games
    - Instruction screens
    - Leaderboards
    - Friend system

## Reflection
- For this iteration:
  - What went well?
  - What did not go well?
  - Discuss aspectes such as planning, development, testing, and team management
- Do you consider the final project a success? Why or why not?

Because each of us had structured roles, our experiences of what went well and what didn't are very different from each others' and because of that, we've included every person's experience point by point.

- Preston
  - **What went well?** Deploying our project to Google Cloud was easy once I figured out how to create my own deployment scripts and maneuver around the google app environment. The hard part was getting to that point because it took some time to understand everything that was going on but I was eventually able to make it work.
  - **What did not go well?** Getting my chat to work with the lobby system we have implemented was a hassle. At first I didn't understand the API we had so getting the user's lobby information and manipulating the data was difficult.
  - For planning and development I had to work with others in solidifying when we had a release that was ‘good enough’ for a deployment  so they could test the multiplayer functionality. Testing the chat box was easy because I could put it in development mode and test it on my local machine.
  - Overall, I would consider this project a success. I got to learn about a very interesting language (JavaScript), apply useful information from class to deploy a web app to Google Cloud, and accomplish many goals of the goals we had originally planned for the project.
  
- Jerry 
  - **What went well?** Almost everything went well. Implementing user accounts, converting games to multiplayer, and creating our lobby system was very straightforward and easy.
  - **What did not go well?** Because most of my job was implementing things on the backend of our app, I would create basic UIs that favored functionality over design and that left a lot to be desired by the users. I had a hard time converting my functional UIs to ones that were functional, intuitive, and pretty.
  - As for planning, I planned my time appropriately and spread out my work fairly evenly over the semester, however I don't think this is the case for the whole team. Development went smoothly for the most part. We were able to test our platform really well for the first half of the semester, but by the end we had to almost skip testing completely to prioritize finishing up our games for the presentation. I was in charge of team management and I thought I did an okay job at giving out tasks but it was hard to keep everyone on track and that led to many features getting cut and caused us to deliver a subpar product.
  - I do not consider our project a success. I was able to use our project as a reason to learn JavaScript and get my foot in the door of web design, but our UI was unfinished, we didn't get to implement all of our goals, and there were plenty of bugs that didn't get removed due to poor testing and time crunch towards the end.
  
- Michael
  - **What went well?** Writing the client side code for our games was quick and easy.
  - **What did not go well?** Modifying those games to work with the server was a lot harder than anticipated. I am used to the thread and socket models used in Java and C so having to use MongoDB to store and retrieve data was difficult to get used to.
  - As for planning, I wish that I had planned out my time management better because I did not do a great job of spreading out the workload evenly through the semester so by the end of the semester I had to work overtime to meet our deadlines. In regards to team management, our team could have done a better job of explicitly divvying up the work. And for testing, we originally did a good job with testing for bugs and squashing them, but towards the end we ran out of time and that caused us to leave a few in our presentation. 
  - I would say that the project was a success. While I wish we had been able to finish the UI and create more games before our presentation, we were able to present a somewhat working product and achieve our main goal of laying the groundwork to easily add games in the future.
  
- Howard
  - **What went well?** I was able to implement UI scaling with relative ease and made it so our project looked good on mobile screens.
  - **What did not go well?** Working with the CSS and HTML separately on the UI was not very effective, it caused me a lot of problems and slowed down my development time dramatically. Also, I didn't consider that basic UI components such as buttons would look different between browsers and that led to a fragmented UI/UX.
  - Planning to do my part was a struggle due to other classes piling work on me. Development took some time to get up to speed. Testing was very easy to do because Chrome's mobile dev mode let me scale our web page to find any quirks. Team management was okay, handing out tasks should have been done earlier though.
  - I consider our project a success because we achieved the main goal of our project by creating a functional experience that we could build upon later.
