# Morph website template

This is a Morph website. It is powered by the Morph template — a static site
rendering engine written using Next.js (`output: "export"`).

Traditionally, in order to edit a website, one had to write in pure HTML. This
is challenging for website administrators who have limited experience with HTML
as it is not immediately readable or intuitive to non-experienced users.

Hence, Morph uses [a set of components](../packages/components) that is
framework-agnostic and allows website administrators to easily create
high-quality websites. Morph uses block-based editing, as opposed to Markdown,
as it is more intuitive to site editors. Block-based editing also allows us to
implement constraints on component properties, nudging site editors to develop
their site in a way that is easily understood and accessible.

In development this app also serves as the **live preview** target: publishing
from Studio in local-development mode exports static files into
`.local-publish/`, which this app renders on the fly.
