---
layout: post
title: What makes a good developer?
---

I'm not going to offer anything groundbreaking here. But having worked with a
variety of teams of talent over the years, I wanted to articulate what I think
makes a good Java developer. By putting these thoughts down, I hope to forge a
little more of a formal idea of what I'm looking for the next time I run into
new talent and have to assess it and work with it.

<!--more-->

Unfortunately, the reality is you're never really going to know what you've got
until you're working with a developer and you see him or her make that first
critical decision in the project pressure cooker. Interviews help and code
samples are great, but they are pretty highly controlled artifacts and evidence.
They're <em>in vitro</em>, not <em>in vivo</em>. Real life conditions for a
developer are fractious. Deadlines loom, clients transmogrify, PMs hound and
every developer action gets instantly tabulated in the ledger of present and
future cost (how much
<a href="http://martinfowler.com/bliki/TechnicalDebt.html">technical debt</a>
did you just incur when made that lousy decision?).

Here are my few short and broad characteristics of good devs. I'll follow up
with a little discussion of how to spot these traits and why they are important.
It might not be possible to know for sure you've got a good developer until
you've worked with them, but it's imperative that you know before you're tearing
out a third of your code base a month before your deadline.

A good Java developer...

    - Has varied experience kept at an arm's length.</li>
    - Has curiosity plus adaptability.</li>
    - Communicates persuasively.</li>
    - Prefers simplicity to novelty.</li>

Experience is essential. How much? 5 years? 10? I'll take a dev with five years
of experience on five substantially different projects over a dev with 10 years
of experience working in one environment. I want a developer that has strong
ideas about the right way to do things, not a strong opinion about a particular
way of doing things. A developer that looks at a problem and makes a decision on
the best way to solve it is usually a developer who has solved it a few
different ways in the past. A developer who sees a problem and immediately grabs
a chunk of code and says "here's how we did that" is going to put a lot of code
in your project that is going to get ripped out. Who does that? A developer who
has logged 16,000 hours JDBC programming, for example, is going to do that
because they have long ago stopped thinking about how to get data from the
database (in order to preserve their sanity). A developer who has implemented a
couple different ORM providers, used Spring's JDBC template and done straight
JDBC programming (in reverse chronological order) is much more likely to have
ideas about how to do data access in their tool belt rather than specific data
access implementations.

The later developer with more diverse experience is also going to carry a
healthy skepticism about past implementations. They are going to keep those at
arms length because they've had the opportunity to compare them to different
approaches which inevitably highlights shortcomings.

Which brings us to curiosity and adaptability. Varied experience sets the stage
for curiosity. If you've done something three different ways you're much more
likely to be curious and looking to find a fourth way that encompasses the best
of the previous three and adds the missing salt. You're also much more likely to
find and consider radically different or breakthrough approaches (which carry
the potential for huge time savings or jumps in profitability). Have you done
years of SQL, HQL &amp; EJB QL? Then you're probably going know when to try
NoSQL! Have you done JSF and used half dozen Javascript AJAX libraries? Then
you're probably going to know when it's time to try FLEX.

But you can't switch to a new technology unless you're able to articulate
(especially in writing) specific advantages. This almost always boil down to an
effective outline of short or long term cost and time savings. And, you need to
be able to do this to a variety of audiences: non-technical clients, managers,
PMs and your dev peers. Being able to write a persuasive argument doesn't just
demonstrates a certain quality or refinement of thinking, it demonstrates an
ability to know and listen to an audience. A good developer doesn't just know
their audience, he or she is sensitive to their interests and capable of
tailoring communications to them. You can start to feel developers out on this
front from the first email resume submission. Look for emails and dialogue that
demonstrate even and measured assessment of technology rather than singular
endorsements based on recent personal experience. An average dev will tell you
that they've built an app using Ext GWT, a better dev will offer an opinion
about when it's appropriate to use Ext GWT and probably have a short list of
pros and cons to offer off the top of their head.

The last and most important attribute of a good Java developer (or any developer
for that matter) is a proclivity for simplicity. Simple code is maintainable
code. Maintainable code is good code. You can usually see this in code samples.
Are methods discrete and short as possible? Is the formatting and syntax
consistent? Does the code tell you clearly what it's doing and do the comments
tell you consistently why? You can spot the habits of good developers in the
simplest of things. Does code use the Java 5 for-each construct here and an
iterator there? Is the StringUtils being used in one spot and a custom algorithm
in another? That's a dev who's discovered a new way of doing something and
switched to it without switching it everywhere. That's also a maintenance
problem. Simplicity with an eye towards maintainability is an especially
important attribute for a developer who does your framework selection. A good
developer won't put a framework into the mix until they know how to use it and
are confident that there are time and maintenance advantages.

If you talk to a developer, look at their resume, check out their code and work
with them even just a little bit, you'll see pretty quickly whether or not they
possess or have the potential to possess these attributes. If they do, you've
got a good developer or a good developer in the making on your hands.
