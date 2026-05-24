# Style Partials

`global.css` is now only an import manifest. `tokens.css` keeps shared design variables, `base.css` keeps the reset and page base styles, `site.css` preserves the current visual system, `work-pages.css` owns archive/detail page rules, `overlays.css` owns story/lightbox surfaces, and `responsive.css` owns viewport and reduced-motion overrides.

Future UI work can move stable blocks from `site.css` into smaller files such as `components.css` without changing Astro imports.
