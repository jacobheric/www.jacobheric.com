---
layout: post
title: Jacob's List
image: list_screenshot.png
---
Having just rolled off a very long contract, I've finally found a little time to play around with new and interesting tech.  To that end, I wrote up a small (but sweet, IMHO) realtime list web application using the <a href="http://meteor.com/">Meteor framework</a>.


<!--more-->
<strong><em>tl;dr</em></strong>:

<a href="http://list.jacobheric.com">The running app.</a>

<a href="https://github.com/jacobheric/list">The code</a>.

<strong><em>What it looks like</em></strong>:

{% picture "list_screenshot.png", "Jacob&#039;s List App Screenshot"  %} 

<strong><em>What it does</em></strong>:  It's a simple, mobile first, realtime sharing list application.  I wrote it so my wife and I could have a shared list space for groceries, hardware store runs, etc.  No need to text last minute additions.  No apps to install.  Just add items to the list.  Everyone who's on your unique list url sees the new thing immediately.  Swipe left to delete.  Swipe right to strike out.  Touch to edit.  That's it.  We've been using it heavily and it's really handy.  In reality, the app is little more than a conglomeration of the features offered by their nice little suite of demos (with some special sauce thrown in).  So nothing ground breaking.


<!--more-->

<strong><em>Background</em></strong>: If you haven't heard of it, Meteor is a frighteningly ambitious full stack web application development framework.  Take a gander at their <a href="http://docs.meteor.com/#sevenprinciples">Seven Principles</a> to get an idea of the force and magnitude of their vision.  It's essentially beta software (at version 0.5.9 at the time of this writing). But, they've got <a href="http://www.quora.com/Meteor-web-framework/How-is-Meteor-funded-Will-it-be-around-a-couple-of-years-from-now/answer/Mattias-Petter-Johansson?srid=uvTV&share=1">funding and at least some semblance of a plan to produce revenue</a>. Also, the offering currently has a polish beyond what you might normally expect from beta.

<strong><em>Preview Conclusion</em></strong>: Meteor is a fantastic early stage framework that shows great promise and will soon be a great platform candidate for certain types of realtime web apps.  It's probably going to have to throw in some more mobile-centric features (RESTful endpoints on the server, support or plugins for every manner of reactive, touch centric UIs, etc.) soon. But I have little doubt they will.


Meteor is built on top of <a href="http://nodejs.org/">Node</a>, so we're talking server side javascript, of course.  But, Meteor has eschewed asych/callback complexities by running server requests in node fibers (one thread per request).  Some aspects of the framework are sure to delight (or terrify) you: database everywhere, reactivity, live html.  Database everywhere is a powerful feature, but one that will likely have to be rebranded a bit to get the sort of adoption they might want in the enterprise (enterprise people don't want their database everywhere, they want it in one preferably very secure location).  What database everywhere really means (currently) is that data is stored in separate but matching collections on the back and front end (mongodb and minimongo respectively).  If you let it, the framework with broker the collection data back and for automatically for you (you can also lock that down).

<a href="http://docs.meteor.com/#reactivity">Reactivity</a> is really a killer feature.  Whether or not Meteor eventually gains traction, I suspect this pattern will be adopted widely by other frameworks.  After developing a couple small applications in Meteor, I consider reactivity a sine qua non feature of web application development.  With Meteor, you've got reactive datasources backing reactive computations backing live html template.  This is a very slick way to deliver content realtime to the browser, as you'll see.

Yada, yada. Time to show code. Here's the server side publication of the two collections (lists & things) that the app uses:

<script src="https://gist.github.com/jacobheric/5289586.js"></script>

Straightforward. Note that this code resides in a directory called server, so Meteor will not ship this code to the client.  The client and the server do share collection notions, so those are declared in a file called model.js and shipped down to the client:

<script src="https://gist.github.com/jacobheric/5289606.js"></script>

Also straightforward.  Note that collection security is specified using javascript "allow" functions.  This feels a little bit awkward at first, but it's probably better than the alternatives.

And, here's the client code that subscribes to the collections published by the server above:

<script src="https://gist.github.com/jacobheric/5292339.js"></script>

A couple of things to note about the things and lists subscriptions.  The things subscription is tied to the current list identifier, so you only see relevant things.  The list subscription handle (<em>listsHandle</em>) is tied to an empty loading div in the DOM.  This ensures that the list has been loaded into the local collection from the server before it is accessed.  I picked this handy little trick up from one of the official examples.  It prevents you from getting empty collections when accessing them at startup (a source of frustration).

You'll see the list handler detects if there is no list.  In this case (e.g. you land on the naked domain for the first time), it creates one and reroutes the request to a unique url that corresponds to the list id.  Share the url, share the list.  The app uses backbone strictly for routing.  The router implementation is straight from the Meteor examples.

The <em>template.list.loading</em> declaration is Meteor's way of supplying data to the live html <em>loading</em> div in the <em>list</em> template (<a href="http://handlebarsjs.com/">handlebars</a> style).


Speaking of the view.  Here is is in it's entirety:

<script src="https://gist.github.com/jacobheric/5292407.js"></script>

Not much to it.  Some css ensures that the desktop version gets delete/strike out links instead of just touch gestures.  BTW, I added touch/gesture support using the nice, lightweight <a href="http://eightmedia.github.com/hammer.js/">hammer.js library</a>.  Hammer has been wired up to the list item html element via Meteor's rendered event so that we can guarantee the element is already in the DOM:

<script src="https://gist.github.com/jacobheric/5292450.js"></script>

Also note that we delete the items via <em>Meteor.call('removeListItem', id)</em>. This demonstrates how to invoke a method on the server rather than just deleting the record from the local collection and allowing meteor to automagically propagate that change to the server collection (an operation which we have expressly forbidden via the model allow declaration above).

<strong><em>Conclusion</em></strong>:  Even at this early stage, Meteor largely delivers on it's ambitious promise.  I built the first, fully functional version of this app in about an hour.  I spent more time adding touch/gesture support than I did core features. All in all, Meteor is a very feature rich and polished early stage web development framework offering.  It's an interesting and compelling implementation of a single language stack using server side javascript.  I can definitely see using it for certain realtime applications in the near future.  If they add a few more features (RESTful endpoints, mobile-centric UI), then I can see adopting it for a wider variety of applications.
