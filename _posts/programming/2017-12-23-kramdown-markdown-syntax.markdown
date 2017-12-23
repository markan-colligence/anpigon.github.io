---
layout: post
category: programming
title: "kramdown syntax "
date:   2017-12-23 01:53:10 +0900
---
# Kramdown Syntax

# H1 header

## H2 header

### H3 header

#### H4 header

##### H5 header

###### H6 header
---

First level header
==================

Second level header
-------------------


---


This is a paragraph  
which contains a hard line break.


---


> A sample blockquote.
>
> >Nested blockquotes are
> >also possible.
>
> ## Headers work too
> This is the outer quote again.


---


This is a sample code block.

    Continued here.
    my code here


---

~~~~~~~~
Here comes some code.
~~~~~~~~

---


1. This is a list item
    > with a blockquote
    ##### and a header

2. Followed by another item


---


term
: definition
: another definition

another term
and another term
: and a definition for the term

---


| A simple | table |
| with multiple | lines|

---

| Header1 | Header2 | Header3 |
|:--------|:-------:|--------:|
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|----
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|=====
| Foot1   | Foot2   | Foot3
{: rules="groups"}

---



---


A [link](http://kramdown.gettalong.org)

---

This is a text with a
footnote[^1].

[^1]: And here is the definition.

---

This is a text with a
footnote[^2].

[^2]:
    And here is the definition.

    > With a quote!

---

Inline attribute

This is *red*{: style="color: red"}.

---


~~~js
// Example can be run directly in your JavaScript console
// Create a function that takes two arguments and returns the sum of those
// arguments
var adder = new Function("a", "b", "return a + b");
// Call the function
adder(2, 6);
// > 8
~~~


---
