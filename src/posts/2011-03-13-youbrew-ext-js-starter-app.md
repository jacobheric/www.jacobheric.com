---
layout: post
title: YouBrew Ext JS starter app
---
<strong>A Java, Spring, Hibernate, Spring-MVC, RESTful services, JSON, Ext JS starter app...</strong>


<!--more-->
Last year, I put together a little homebrew starter Spring webapp with a Flex frontend (writeup <a href="http://www.jacobheric.com/2010/02/09/spring-flex-integration-with-blazeds/">here</a>).   Over the last year, I've written a few Java Spring webapps with Ext JS frontends.  So, I decided to revisit my youbrew starter app to create an Ext JS version.  

For those that would rather get cracking with the code than listen to me blather on about it, here you go: <a href="https://github.com/jacobheric/youbrew-extjs">https://github.com/jacobheric/youbrew-extjs</a>.

<strong>Ext JS</strong>

For those of you that live under a rock, Ext JS is a javascript UI component framework.  Check it out over here:  <a href="http://www.sencha.com/">http://www.sencha.com/</a>.  As far as javascript UI component frameworks go, I think Ext JS is without peer.  They offer good API documentation, healthy forum support, and an example component gallery that is very impressive and compelling:  <a href="http://dev.sencha.com/deploy/dev/examples/">http://dev.sencha.com/deploy/dev/examples/</a>.  They've also moved into the mobile space with an HTML5 touch offering that's really interesting and could eventually provide a viable alternative to writing native mobile apps for a variety of platforms (Android, iOS, etc.).  

Ext JS is offered under a dual license.  It's open source (GPL v3) if you're developing an open source app.  Otherwise, you'll need to purchase a commercial license.  

I've knocked out a few of these Ext JS java spring webapps in the last year.  I've also developed in parallel at my current contract with another team working on similar Ext JS apps.  I'm settling into an architecture similar to what you see in this starter app.  My first project made heavy use of JSP tag libraries to manage the Ext JS components.  Generating javascript in JSP tag libs is not pleasant and I would recommend avoiding that approach.  I've found that it's better to pitch Java based view component technologies altogether and work with a pure javascript front end.

You'll see that this app brokers information to the view using RESTful JSON services.  Ext JS components play very well with JSON (see the JSON data store component for example).  Later versions of Spring MVC offer easy annotations based RESTful service setup and very slick Java/JSON serialization/deserialization (with the help of Jackson).  The result is a nice match of technologies to marry the pure Javascript fronend to the "enterprise" Java backend.  JSON is a perfect fit for sending data back and forth to a rich web app.  It's easy to work with.  It's clean and lightweight and fast.  Communicating with the frontend using RESTful JSON also provides a nice platform for dropping in additional (or replacement) UIs and offers you a set of ready-made APIs for systems integration.  


<!--more-->
<strong>Multi-Module Maven Architecture</strong>

For this version of the starter, I beefed up the backend architecture a bit.  The app now features a multi-module Maven app design.  I resisted multiple Maven modules in my applications for a while.   They still present some challenges for hot-deployment across modules while debugging in development.  But, ultimately, they provide a nice compartmentalization of functionality that encourages the separation of concerns and permits the packaging and reuse of parts of the application elsewhere in the enterprise.

There's not a lot to say about the multiple Maven module setup.  If you're not familiar with it, I recommend <a href="http://www.sonatype.com/books/mvnex-book/reference/multimodule-web-spring.html#multimodule-web-spring-sect-project-description">Sonatype's texts on the topic</a>, they are indispensable.  

Take a look at the packaging and the module dependency info in the poms, and you'll see what's going on pretty quickly.  See the parent pom's package type is "pom" (conveniently enough) and it exists to aggregate the modules listed in the module section:

<script src="https://gist.github.com/867734.js"> </script>

See how the webapp's package type is "war" (obviously enough) and it has dependencies on its sibling Maven modules (domain, persist & services):

<script src="https://gist.github.com/867739.js"> </script>

There are Jetty and Tomcat plugins for debugging via Maven using embedded containers.  In my real apps, I use the Cargo plugin to have Hudson deploy to all the other lifecycle container environments (dev, prod, etc.).

<strong>Domain Objects, Persistence & Services</strong>

The domain objects are vanilla JPA entities.  Configuration is annotations based.  The provider is Hibernate:

<script src="https://gist.github.com/867742.js"> </script>

The persistence module provides DAO services.  DAO has been <a href="http://rrees.wordpress.com/2009/07/11/the-dao-anti-patterns/">probably rightly maligned as an anti-pattern in the post-EJB/J2EE world</a>.  I've been cooking up some (rather drastic) mechanisms to dispense with it lately, but old habits die hard.  

Most of the DAO work gets done in a base DAO implementation class that operates on generic entities and IDs.  The constructor takes care of the class type creation generically and there are some neat conveniences in there (see findByCriteria).  Those ideas are not mine, I read about them <a href="http://community.jboss.org/wiki/GenericDataAccessObjects">here</a> and elsewhere.

<script src="https://gist.github.com/867748.js"> </script>

The service tier both publishes contracts and provides implementations.  The controllers in the front (web application module) interact only with the service tier.  As with the domain and persistence tiers, everything is wired up with Spring annotations.  Service dependencies are injected (@Autowired) into the controllers (for instance).  The java code refers only to the contracts (interfaces) and Spring supplies the implementation classes at runtime.  Unlike the persistence tier, the service tier does not consolidate functionality into a base class that operates on generics.  It could and I often do it that way, but explicit (if repetitive) service contracts are nice and clear.  Obviously, for the simple CRUD offered in the starter app, there would be almost nothing outside of a base service class.

<strong>The webapp:  Spring MVC, RESTful Services and JSON</strong>

The meat of the starter web app is in the web app module (no surprise there).  Peruse the Spring context configurations in the WEB-INF/spring directory.  The general app-context.xml does nothing more than setup package scanning and import the other configs.  The persistence config is just what you'd expect.  The mvc config sets ups the Jackson Java-JSON serializing/deserializing in the form of a HttpMessageConverter bean configuration.  Note that the normal &lt;mvc:annotation-driven&gt; directive is dispensed with in favor of setting up the default annotation handling bean(s) manually.  

<script src="https://gist.github.com/867782.js"> </script>

The specified GlobalBindingInitializer and related JsonObjectMapper Java objects do little more than setup a default date format for Jackson.   The rest of the Spring MVC setup is pretty ordinary.  You'll see the Ext JS javascript library code in the root of the webapp.  The app's custom Javascript (just a few files) is in the script directory.  The only jsp view is the index and that simply bootstraps Ext JS:

<script src="https://gist.github.com/867794.js"> </script>

The real power here is the simple setup of RESTful JSON services using Spring MVC annotations configuration.  The controller is just a POJO (no extension or implementation of any Spring or servlet constructs).  The base controller is my own class that consolidates some generic validation and message handling.  It also encapsulates a service result wrapper (which should probably be pulled out of there) that provides some response metadata (e.g. success, message and record count properties) that the client expects.  I would normally inject spring security here too, but I left that out of this app.  The controller stereotype annotation (@Controller) maps this class to a URL pattern.  You'll see further mapping annotations on the example methods narrowing requests by HTTP GET, POST, PUT, etc.

The @ResponseBody, @RequestBody & @ModelAttribute annotations direct Spring (via the underlying Jackson JSON library) to serialize the incoming HTTP request body JSON to the relevant Java parameter type and deseriallze the Java response type back to JSON in the HTTP response body.  Spring MVC does RESTful service setup and HTTP message conversion (for either JSON or XML) really well.  It's clean, it's simple, and I enjoy using it.

The only other things to note here are the injection of service dependencies by Spring using @Autowired. Again, the class is only aware of the service interface and the container provides the implementation.  JSR 303 bean validation is abstracted out to the base controller for reuse.  Also note that there is a bit of code to fetch the yeast object if that was changed in the UI.  Overall, there is a little bit more code than I'd like here and in the Javascript UI to handle these associations.  It's on my short list to make that simpler.

<script src="https://gist.github.com/868144.js"> </script>

<strong>The Ext JS Javascript</strong>

Finally, onto the Ext JS app:  youbrew.js.  This app is pulled directly from one of the Ext JS grid examples.  It's a simple editable CRUD grid and related form.  The form doesn't really serve a purpose given the grid's edit capabilities (other than perhaps greater visibility/clarity given the wide form fields).  But, I left it in there to show how you could push the user to a form for editing rather than do that in the grid.  

On the apps I've been working on lately, I use an MVP style design pattern to organize all Javascript files into Presenter, Model and View files (e.g. forms and grids).  I borrowed this pattern from an Ext JS app written by a buddy of mine <a href="http://www.portlandwebworks.com/">where I'm currently working on a contract</a>.  I didn't implement that pattern here.  But, pulling the Ext JS model (e.g. store) code out into its own file would go a long way towards doing that.  At any rate, some architectural pattern is necessary in large Javascript apps to prevent code sprawl and repetition.  

The first part of youbrew.js sets up the grid's backing store (and related reader, writer and http proxy).  These could all be rolled up into an aggregate JsonStore object, but I left the parts broken out here for clarity.  Things here are pretty self-explanatory.  The Json reader defines the record layout and other metadata items (note that these are not strictly necessary as we are sending them along in the Json response itself).  The Http proxy ties the crud operations to our RESTful service URLs.  The writer indicates that all record fields will be sent to the server (writeAllFields: true).  Setting that to false will send along only the changed data.  The listful property means that the store will send along a set of changed records in a list.  You'll see the backend controllers are all setup to operate on these lists.  This combined with the "autosave: false" property on the store mean that the user can edit a bunch of records in the grid and then send them all along at once by hitting save.   Also note the listeners setup on the data proxy to capture events for displaying messages.  This only needs to be done once for the application.   Also note that the store is loaded with some paging parameters (we'll revisit these in the grid code).  You'll also see a separate store to populate the yeast lookup.

<script src="https://gist.github.com/867803.js"> </script>

Here's the remainder of youbrew.js.  It defines the grid columns and then instantiates the grid and form (rendering them to elements referenced in index.jsp).  The code here is very like the editable grid example in the Ext JS gallery.  But, I've embedded a combobox in the grid for choosing the yeast used in the recipe from a list.  As I said before, there is a little bit too much code to handle the collection association (note the renderer code on the combobox and the rowclick handler on the grid to pass the yeast name to the form).

<script src="https://gist.github.com/868188.js"> </script>

I'll let the recipeForm.js code speak for itself.  It simply submits the data back into the grid for the purpose of persistence.  The only interesting things to note in there are the combobox for the yeast lookup and the combobox "ref" property that ties this element to a class member variable for reference elsewhere in code (very handy).

Because it constitutes the bulk of the Ext JS app, I'll show you the entire recipeGrid.js before wrapping up.  It's a nice demonstration of an editable grid with an embedded combobox to do lookups on the yeast object using a second store.  The grid also features pagination and search, both requirements when working on large datasets.  All search and paging parameters are passed (via the store) to the backend as HTTP request params, see start, limit & query:

<a href="/assets/image/grid-http-request-params.png"><img src="/assets/image/grid-http-request-params.png" alt="Grid params sent along as http request params" title="grid-http-request-params"  /></a>

These are in turn serialized transparently to a very plain java search criteria object in the backend controller and handed off through the service layer to a DAO that does all search and pagination in a single method using Hibernate.  Here's that do-it-all-method.  In a real app, I'd break these out and handle pagination generically.  Note some slight-of-hand to get the total record count before executing the page-restricted search criteria.  This property is passed back to the view (in the criteria object):

<script src="https://gist.github.com/868205.js"> </script>

As promised, here's the whole editor grid code.  With the paging toolbar, search toolbar and embedded combobox, it offers a whole lot of functionality with a relatively small amount of code.

<script src="https://gist.github.com/868194.js"> </script>

<strong>Wrap Up, What Next?</strong>

All in all, Ext JS is a great Javascript UI component library and it fits very nicely with this backend stack.  I've enjoyed working with it.  Of course, there is a lot of Spring Java plumbing going on.  Given Ext JS's support for JSON, it would also be a natural fit to store those directly in a JSON document store (couchDB, MongoDB, etc.).  In that scenario, the Java backend grows cumbersome and begs to be replaced by a more appropriate server side platform (I'm looking at you node.js).  Hopefully that will materialize in the youbrew starter app soon and generate another post.  
