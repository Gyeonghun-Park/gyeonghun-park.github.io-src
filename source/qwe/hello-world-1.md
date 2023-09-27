---
title: An overview of all Markdown elements
date: 2023-08-01 00:11:09
tags: linux
---

- [Block Elements](#Block-Elements)
  - [Paragraphs and Line Breaks](#Paragraphs-and-Line-Breaks)
  - [Headers](#Headers)
  - [Blockquotes](#Blockquotes)
  - [Lists](#Lists)
  - [Code Blocks](#Code-Blocks)
  - [Horizontal Rules](#Horizontal-Rules)
  - [Table](#Table)
- [Span Elements](#Span-Elements)
  - [Links](#Links)
  - [Emphasis](#Emphasis)
  - [Code](#Code)
  - [Images](#Images)
  - [Strikethrough](#Strikethrough)
- [Miscellaneous](#Miscellaneous)
  - [Automatic Links](#Automatic-Links)
  - [Backslash Escapes](#Backslash-Escapes)
- [Inline HTML](#Inline-Html)

This post gives an overview of all Markdown elements and how they are rendered by this theme.

## Block Elements

### Paragraphs and Line Breaks

**Paragraphs**

HTML Tag: `<p>`

One or more blank lines. (A blank line is a line containing nothing but **spaces** or **tabs** is considered blank.)

Code:

```txt
This will be
inline.

This is second paragraph.
```

Preview:

---

This will be
inline.

This is second paragraph.

## Line Breaks

HTML Tag: `<br />`

End a line with **two or more spaces**.

Code:

```
This will be not
inline.
```

Preview:

---

This will be not
inline.

---

> ## This is a header
>
> 1. This is the first list item.
> 2. This is the second list item.
>
> Here's some example code:
>
>       return shell_exec("echo $input | $markdown_script");

```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
```

![potato](/images/logo.png)

<table>
    <tr>
        <td>Foo</td>
        <td>Foo</td>
        <td>Foo</td>
        <td>Foo</td>
    </tr>
</table>

<span>**Work**</span>

<div>
    **No Work**
</div>
