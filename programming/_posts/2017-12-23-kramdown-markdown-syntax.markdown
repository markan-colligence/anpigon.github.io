---
layout: post
title: kramdown syntax
---

간단정리 Kramdown Syntax

## **1. Header**{: style="color: #0B518B"}.

<pre>
# H1 header

## H2 header

### H3 header

#### H4 header

##### H5 header

###### H6 header
</pre>

# H1 header

## H2 header

### H3 header

#### H4 header

##### H5 header

###### H6 header

---

## **2. Level Header**{: style="color: #0B518B"}.

<pre>
First level header
==================

Second level header
-------------------
</pre>

First level header
==================

Second level header
-------------------

---

## **3. Line Break**{: style="color: #0B518B"}
<pre>
This is a paragraph  <= 공백 2개 들어감
which contains a hard line break.
</pre>

This is a paragraph  
which contains a hard line break.

---

## **4. BlockQuote**{: style="color: #0B518B"}

<pre>
> A sample blockquote.
>
> >Nested blockquotes are
> >also possible.
>
> ## Headers work too
> This is the outer quote again.
</pre>

> A sample blockquote.
>
> >Nested blockquotes are
> >also possible.
>
> ## Headers work too
> This is the outer quote again.

---

This is a sample code block.

<pre>
    Continued here.
    This is code block
</pre>

This is a sample code block.

    Continued here.
    This is code block

---

## **5. Code Block**{: style="color: #0B518B"}

<pre>
~~~~~~~~
Here comes some code.
~~~~~~~~
</pre>

~~~~~~~~
Here comes some code.
~~~~~~~~

---

## **6. BlockQuote**{: style="color: #0B518B"}

<pre>
1. This is a list item
    > with a blockquote
    ##### and a header

2. Followed by another item
</pre>


1. This is a list item
    > with a blockquote
    ##### and a header

2. Followed by another item

---


## **7. Term**{: style="color: #0B518B"}

<pre>
term
: definition
: another definition

another term
and another term
: and a definition for the term
</pre>


term
: definition
: another definition

another term
and another term
: and a definition for the term


---

## **8. Table**{: style="color: #0B518B"}

<pre>
| A simple | table |
| with multiple | lines|
</pre>

| A simple | table |
| with multiple | lines|

---

<pre>
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
</pre>


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

## **9. Link**{: style="color: #0B518B"}
<pre>

A [link](http://kramdown.gettalong.org)
</pre>

A [link](http://kramdown.gettalong.org)

---

## **10. FootNote**{: style="color: #0B518B"}
<pre>

This is a text with a
footnote[^1].

[^1]: And here is the definition.
</pre>

This is a text with a
footnote[^1].

definition은 아래에.

[^1]: And here is the definition.

---

<pre>

This is a text with a
footnote[^2].

[^2]:
    And here is the definition.

    > With a quote!

</pre>


This is a text with a
footnote[^2].

[^2]:
    And here is the definition.

    > With a quote!

---

## **11. Inline Attribute**{: style="color: #0B518B"}

<pre>
This is *red*{: style="color: red"}.
</pre>

This is *red*{: style="color: red"}.

---

## **12. Code Highlight**{: style="color: #0B518B"}

<pre>
~~~js
// Example can be run directly in your JavaScript console
// Create a function that takes two arguments and returns the sum of those
// arguments
var adder = new Function("a", "b", "return a + b");
// Call the function
adder(2, 6);
// > 8
~~~
</pre>

~~~js
// Example can be run directly in your JavaScript console
// Create a function that takes two arguments and returns the sum of those
// arguments
var adder = new Function("a", "b", "return a + b");
// Call the function
adder(2, 6);
// > 8
~~~

highlight 문법 쓰지 말것

---

## **13. Abbreviation**{: style="color: #0B518B"}
<pre>
This is an HTML
example.

*[HTML]: Hyper Text Markup Language
</pre>

This is an HTML
example.

*[HTML]: Hyper Text Markup Language

---
