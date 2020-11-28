---
layout: post
title: Spring Flex integration with BlazeDS
excerpt: ''


---
As I mentioned in an earlier post, I have some <a href="http://www.jacobheric.com/2010/01/20/jsf-an-ria-retrofit/">architectural reservations about using JSF as a platform for Rich Internet Applications</a>.  Flex, on the other hand, has some features which make it an attractive alternative platform for RIAs, namely:


- Client management of UI components (e.g. in-client MVC for UI)</li>
- Flash runtime addresses cross-browser issues of javascript/xhtml/css solutions</li>
- UI builder tools (Flex Builder, IntelliJ, etc.)



Now I realize that point number two may be a con rather than a pro for open source purists.  This is a legitimate point.  The Flash player is not open source.  However, most of the specs surrounding Flash/Flex are in fact open source, including the <a href="http://en.wikipedia.org/wiki/SWF">SWF file format</a>, the <a href="http://en.wikipedia.org/wiki/Action_Message_Format">AMF protocol </a>(which I use in the example below) and Flex framework itself.  <a href="http://blogs.adobe.com/open/2010/02/following_the_open_trail.html">Here's an (unofficial) note from Adobe</a> on the state of the open source and Flash.  I'll leave you to judge for yourself the merits of the justifications outlined there for keeping the runtime closed (e.g. proprietary video codecs).

Another interesting long-view consideration for Flex adoption is Apple's refusal to support Flash on its mobile devices (iphone, itouch and nascent ipad).  This is another legitimate consideration.  But, I believe we'll have to wait and see how this plays out before we allow it to impact the decision to implement a Flex RIA solution.  In the near term, if we want to provide a decent experience for Apple's mobile devices, I think we're talking about developing native apps for those devices.   <a href="http://tiffanybbrown.com/2010/02/04/on-apples-ipad-html5-and-the-future-of-flash/">And as far as considering HTML5 as a suitable replacement for Flash</a>, that's definitely another long-term consideration which warrants little more than a wait and see approach.

But enough speculation on the merits of Flex and Flash.  

The real point of this post is to report on my test of Spring Flex Integration using BlazeDS.  I've been very loosely following the BlazeDS project for a couple years now.  It has attracted me because it offers us JEE type developers the potential and promise of essentially tacking an additional RIA onto our existing enterprise Java back ends.  

So, with that in mind, I headed on over to the <a href="http://www.springsource.org/spring-flex">Flex BlazeDS Integration page at Spring</a> to see if it was really that easy to use BlazeDS to implement a Flex RIA against our Spring managed components.  

The short answer (if you don't want to wade through the code samples below) is yes.  I give Spring Flex integration high marks and would definitely consider it for any future RIA solution due to ease of use.  If you have existing Spring managed components, especially using annotations based configuration, it's pretty simple to drop a Flex RIA onto those and let BlazeDS (rather transparently) provide remoting services to the client.


Before I share what I did, I just want to say that I'm not really adding anything new to the example materials already pretty widely available.    The <a href="http://static.springsource.org/spring-flex/docs/1.0.x/reference/html/ch06.html">Spring BlazeDS Integration test drive</a> (originally developed by <a href="http://coenraets.org/blog/2009/05/new-update-to-the-spring-blazeds-integration-test-drive/">Adobe Evangelist Christophe Coenraets</a>) is excellent.  The fine fellows at <a href="http://www.gridshore.nl/2009/05/24/integrate-flex-security-in-mate-using-the-spring-blazeds-integration-project/">Gridshore have also provided an excellent sample application</a> that features full Maven support (the test drive is partially Ant driven).  They also throw in the Mate framework.

The point to my exercise was really just to see what it was like to integrate a Flex front end onto a "typical" Maven managed Spring application.  For the example, I used a MySQL DB and Hibernate ORM.  It is a dead simple CRUD app to manage my home brew (as in beer, not software, I'm a home brewer) recipes.  The app features a modest service interface tier and a very simple DAO implementation, most of which does little more than house BlazeDS related remoting annotations metadata.  

Note that the build uses the <a href="http://flexmojos.sonatype.org/">Flexmojos maven plugin</a> to compile the SWFs with maven.  On this topic, the <a href="http://www.sonatype.com/books/mvnref-book/reference/flex-dev.html">developing with Flexmojos</a> chapter of the <a href="http://www.sonatype.com/books/mvnref-book/reference/public-book.html">Sonatype Maven book</a> is essential reading.

Ok, onto the code.  Which, by the way, I've made available <a href="http://github.com/jacobheric/youbrew-flex">here</a> (see the doc/readme.txt for notes on building it).  The app is currently running <a href="http://jacobheric.com:8080/">here if you want to take a look</a> (but don't count on that being around forever, it's just a transient jetty instance I ran using the maven jetty plugin).  The pom also features the tomcat plugin and it runs fine in tomcat.

The maven configuration is modular.  Using Flexmojos all but necessitates that, see the developing in Flexmojos chapter mentioned above for more information on that.  This is accomplished with the following bit in the root pom, which directs maven to flex and java-web poms under their respective directories:

<script src="https://gist.github.com/jacobheric/5460651.js"></script>

The flex pom is minimal and handles SWF compilation.  See the configuration setting for SWF compilation parameters.  The services bit is important, providing remoting details for the client.  You'll also see some commented out flexmojo goals in there for generating all the Html & Javascript necessary to launch the Flash player.  You're supposed to be able to do this on the fly from the war (in our case java-web) module pom.  But I couldn't get it working properly.

<script src="https://gist.github.com/jacobheric/5460682.js"></script>

A you can see, this configuration points to our AMF remoting channel definition in services-config.xml, which looks like this:

<script src="https://gist.github.com/jacobheric/5460688.js"></script>

The only other Flex related configuration we need on the java web side is to setup the Flex servlet in our web.xml...

<script src="https://gist.github.com/jacobheric/5460703.js"></script>

...and to tell the flex servlet what remoting channel to use in flex-servlet.xml:

<script src="https://gist.github.com/jacobheric/5460718.js"></script>

If you've done Spring Java web development with Maven, you'll be familiar with the pom for the java-web module.  It features all the Spring, Hibernate, MySQL and related dependencies as well as Jetty and Tomcat plugin support for running the app in either container using Maven.  The only quirk here is that I was not able to get the mvn jetty:run or mvn tomcat:run targets working from the root project so you'll need to switch to the java-web directory and and run mvn jetty:run-war or mvn tomcat:run-war.  See doc/readme.txt for notes on how to fix this.  

I won't go into too much detail on the Spring backend as it's a pretty vanilla annotations configuration.  First, we tell spring to scan our components for configuration metatdata in app-config.xml:

<script src="https://gist.github.com/jacobheric/5460721.js"></script>

There are service interface classes in package com.jacobheric.youbrew.services.  Shared CRUD services are consolidated in a BaseService interface.  There are DAO implementations for these services in package com.jacobheric.youbrew.dao.  Again, shared CRUD operations are abstracted out into a BaseDao class.  Each service implementation extends the BaseDao class, which for the purposes of our example does little more than provide a place for service specific BlazeDS remoting metadata.  See the RecipeDao for example:

<script src="https://gist.github.com/jacobheric/5460732.js"></script>

For the Flex client, I basically just used the company manager source code from the test drive examples and altered it to reference my components.  For now, the client source is lacking organizational structure.  I'll head back around and organize that at some point into MVC related packages.  

Here we've got ActionScript objects relating to the relevant Spring managed entities, e.g. see Recipe.as:

<script src="https://gist.github.com/jacobheric/5460744.js"></script>

Lastly, see recipemgr.mxml for an example of invoking our remote service methods.  I've snipped this source heavily so you can focus on how the search click event is wired to the Spring Recipe search (e.g. findByName) service.

<script src="https://gist.github.com/jacobheric/5460761.js"></script>

All told, the process was pretty simple.  I burned a few hours on it over a few days and didn't run into anything too perplexing in the process.  I can definitely see using this tech stack on an application in the future, especially one where there are existing Spring managed components that can be leveraged.  

As I said before, this project <a href="http://github.com/jacobheric/youbrew-flex">source</a> isn't quite there yet as a solid starter for a usable app.  But, I've been doing some reading on Flex best practices and will round back and clean the up the Flex sources and update the Git repo when that happens.
