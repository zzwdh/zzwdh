# Style Partials

`global.css` is now only an import manifest. `tokens.css` keeps shared design variables, `base.css` keeps the reset and page base styles, while `site.css` preserves the current visual system during the larger content/CMS migration.

Future UI work can move stable blocks from `site.css` into smaller files such as `components.css`, `pages.css`, and `responsive.css` without changing Astro imports.
