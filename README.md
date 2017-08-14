
********** HW 1 Journal **********

Starting this assigment, I realized I didn't know the best way to insert data returned from an API directly into an HTML file. While taking this class
I am reading the book "JavaScript and JQuery" by Jon Duckett. In the book, it showed how to edit the DOM with JavaScript, so I elected to do this using
the innerHTML property. I also used css examples from the book to create this page. I attempted to get rid of all the css code I didn't understand and changed the code I did understand. 

The other learning curve for this week was figuring out how to get data from an API. I used Open Weather Map to get the data I used on this page utilizing a call to their API directly in the browser's search bar. I am excited to learn how to more efficiently access and utilize data from APIs soon. 

********** HW 2 Journal **********

This assignment, I also was confused as to what the easiest way to attach my js code to my HTML. Last week I had success with innterHTML so I used it again. Although it took me a little while to grasp the syntax of js in this context, I found the assignment to be fairly painless. On the other hand, this week I reached the AJAX and JSON chapter of my textbook. This was the first point in the book where I began to feel a little bit lost. I think I conceptually understand what is going on, but I am very excited to see some practical examples in class. 

********** Midterm and Final Journal ***********

Midterm Project:

Over the last couple weeks I've been working on a website meant to help djs more easily find tracks for their set lists. After seeing the possibilities of the Spotify API it occurred to me that I could use it to relay information such as bpm, key and popularity to a user. I could also use the API to give dj's recommendations not only based on related artists, but based on key and bpm, metrics which are directly useful for a dj. 

Over the course of working on this I had to overcome many hurdles, the first and perhaps most significant of which was getting Spotify to respond to my AJAX requests. After figuring out how to get a response from their servers using curl requests in terminal, I was able to eventually figure out how to use the "user authentication method" very confusingly outlined on Spotify's developer website. Although this is currently working, it requires some serious revamping if I want my website to be available online. 

Another significant hurdle working on this project was designing the site and implementing the design using CSS. I have long considered myself to be someone who can recognize and occasionally implement good design, but I quickly realized how much of a novice I was at doing this for a website. It became clear that designing this website on paper would have been much easier than designing as I went along with css. 

Final Project:

For the final project I implemented D3 into my website to create a data visualization of the tempo data I was pulling from spotify. It took me a while to figure out what I wanted to do with this. Initially, I created a bar graph to represent each bpm along with corresponding colors. This was unwieldy and too large to be visually useful. I think decided to make a “donut” graph which was much easier to read and gives a user a continuous sense of tempo over time in a hypothetical dj set using a clock metaphor. I also made the tempo markers in the chart correspond to the colors on this graph. Right now I have the “donut” graph sitting in its own mode which actually may be a choice that I regret. I think I my prefer to have it at the bottom of the page or in a different kind of pop up so a user can more clearly see it along side the chart. 

What I learned:
Ultimately, this project has been invaluable because it has proven to me that I should have the confidence to create a website and to pursue my interest in web development. Although there is much more I need to work on for this website before I release it (provide key information, adjustable recommendation parameters, ability to add to add a recommended song to playlist on my site, etc) the most important thing I've learned on this project is a that I need to be organized before embarking on a new project. Having proper wire frames before blindly making my website would have saved me time and stress. Even more importantly, I should have been much more meticulous keeping up a journal as I was working. Sadly, I had forgotten about this after the first few assignments distracted by the excitement of coding. However, had I been taking closer notes, I could have avoided long and complicated issues that occurred more than once where I could not remember a solution. I also need to take better notes in my code to make it clear how everything works. I will say that I have made efforts to keep my code clean and to organize it after long delirious nights of programming. Another thing worth noting is how useful github has been since I began backing up this website. I used it last night to find a solution to a mess I had made. It was thrilling and scary to do this because I likely wouldn't have been able to solve this mistake had I not been using github. Lastly, I need to figure out how to use promises because right now, I am keeping the flow of my website working with functions calling each other in long chains. I realize this is an unsustainable design choice but I don't know how to fix it right now.


