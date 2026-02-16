# squirrelscan Audit Report

**URL:** http://localhost:3000  
**Date:** 2026-02-15T09:34:33.923Z  
**Pages:** 2  
**Version:** 0.0.31

## Health Score

| Category             | Score          |
| -------------------- | -------------- |
| **Overall**          | **46/100 (F)** |
| Core SEO             | 77/100         |
| Accessibility        | 92/100         |
| Security             | 67/100         |
| Crawlability         | 80/100         |
| Performance          | 82/100         |
| E-E-A-T              | 53/100         |
| Content              | 86/100         |
| Legal Compliance     | 44/100         |
| Links                | 95/100         |
| Internationalization | 100/100        |
| Images               | 100/100        |
| Mobile               | 100/100        |
| Social Media         | 100/100        |
| URL Structure        | 100/100        |

## Summary

- **Passed:** 172
- **Warnings:** 41
- **Failed:** 7

---

## Issues

### Performance

_0 error(s), 13 warning(s)_

#### Total Page Weight **[WARN]**

`perf/total-byte-weight`

> Checks the total byte weight of the page

**Solution:**

Reduce total page weight for faster loads on slow connections. Optimize images (use modern formats, compress, serve appropriate sizes). Minify and compress CSS/JS. Remove unused code via tree-shaking. Lazy-load non-critical resources. Target under 1.6MB for mobile users.

| Check             | Status | Message                                      |
| ----------------- | ------ | -------------------------------------------- |
| total-byte-weight | ! warn | Total tracked resources: 3226KB (heavy page) |

<details><summary><strong>total-byte-weight:</strong> Details</summary>

```
3226KB
```

</details>

---

#### Critical Request Chains **[WARN]**

`perf/critical-request-chains`

> Identifies chains of dependent resources that delay rendering

**Solution:**

Critical request chains are sequences of dependent network requests that must complete before the page can render. Reduce chain depth by: 1) Inlining critical CSS instead of linking external files. 2) Adding async or defer to non-critical scripts. 3) Avoiding CSS @import — use <link> tags instead. 4) Using <link rel='preload'> for critical resources. 5) Reducing the number of render-blocking resources in <head>.

| Check                   | Status | Message                           |
| ----------------------- | ------ | --------------------------------- |
| critical-request-chains | ! warn | 2 critical request chain(s) found |

<details><summary><strong>critical-request-chains:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>critical-request-chains:</strong> 2 item(s)</summary>

- CSS: /_next/static/chunks/%5Broot-of-the-server%5D\_\_0ed42198._.css
- JS: /\_next/static/chunks/node_modules_next_dist_build_polyfills_polyfill-nomodule.js

</details>

---

#### Duplicate JavaScript **[WARN]**

`perf/duplicate-js`

> Detects duplicate JavaScript libraries loaded multiple times

**Solution:**

Remove duplicate JavaScript library loads to reduce page weight and avoid conflicts. Check for the same library loaded from different CDNs or versions. Use a single source for each dependency. Consider using a module bundler to deduplicate shared dependencies.

| Check                     | Status | Message                            |
| ------------------------- | ------ | ---------------------------------- |
| duplicate-js-same-version | ! warn | 2 library(s) loaded multiple times |

<details><summary><strong>duplicate-js-same-version:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>duplicate-js-same-version:</strong> 4 item(s)</summary>

- node (16x)
- src (5x)
- node (15x)
- src (4x)

</details>

---

#### Unminified JavaScript **[WARN]**

`perf/unminified-js`

> Detects unminified JavaScript that could be optimized

**Solution:**

Minify JavaScript to reduce file size and improve load times. Use build tools like Terser, esbuild, or UglifyJS. Most bundlers (Webpack, Vite, Rollup) minify automatically in production. Minification shortens variable names, removes whitespace, and dead code.

| Check         | Status | Message                                |
| ------------- | ------ | -------------------------------------- |
| unminified-js | ! warn | 8 JavaScript file(s) appear unminified |

<details><summary><strong>unminified-js:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>unminified-js:</strong> 5 item(s)</summary>

- 1023.3KB, ~260.0KB savings
- 167.0KB, ~53.6KB savings
- 796.9KB, ~722.7KB savings
- 141.0KB, ~60.3KB savings
- 606.5KB, ~292.5KB savings

</details>

---

#### HTTP/2 _[INFO]_

`perf/http2`

> Checks for HTTP/2 protocol support

**Solution:**

HTTP/2 enables multiplexing, header compression, and server push for faster page loads. Most modern web servers and CDNs support HTTP/2 out of the box. Requires HTTPS. Check your server/CDN documentation to enable it. HTTP/3 (QUIC) provides even better performance.

| Check                | Status | Message               |
| -------------------- | ------ | --------------------- |
| http2-https-required | ! warn | HTTP/2 requires HTTPS |

<details><summary><strong>http2-https-required:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

---

#### Source Maps _[INFO]_

`perf/source-maps`

> Checks for source map availability and configuration

**Solution:**

Source maps help debug minified code but can expose source code if publicly accessible. For production: 1) Either remove source maps entirely, 2) Restrict access via server config, or 3) Use 'hidden' source maps uploaded only to error tracking services. Exposed source maps can reveal business logic and security implementations to attackers.

| Check               | Status | Message                              |
| ------------------- | ------ | ------------------------------------ |
| source-maps-exposed | ! warn | 188 potential source map(s) detected |
| source-maps-inline  | ! warn | 1 inline source map(s) found         |

<details><summary><strong>source-maps-exposed:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>source-maps-exposed:</strong> 10 item(s)</summary>

- [from /_next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js](http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js.map)
- [from /_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js](http://localhost:3000/_next/static/chunks/%22)
- [from /_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js](http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js.map)
- [from /_next/static/chunks/node_modules_next_dist_f3530cac._.js](http://localhost:3000/_next/static/chunks/index.js.map)
- [from /\_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index_1dd7fb59.js](http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index_1dd7fb59.js.map)
- [from /_next/static/chunks/node_modules_next_dist_compiled_a0e4c7b4._.js](http://localhost:3000/_next/static/chunks/helpers.js.map)
- [from /_next/static/chunks/node_modules_next_dist_compiled_a0e4c7b4._.js](http://localhost:3000/_next/static/chunks/runtime.js.map)
- [from /_next/static/chunks/node_modules_next_dist_compiled_a0e4c7b4._.js](http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_a0e4c7b4._.js.map)
- [from /_next/static/chunks/node_modules_next_dist_client_17643121._.js](http://localhost:3000/_next/static/chunks/asset-prefix.js.map)
- [from /_next/static/chunks/node_modules_next_dist_client_17643121._.js](http://localhost:3000/_next/static/chunks/set-attributes-from-props.js.map)

</details>

<details><summary><strong>source-maps-inline:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>source-maps-inline:</strong> 1 item(s)</summary>

- [/_next/static/chunks/turbopack-\_23a915ee._.js](/_next/static/chunks/turbopack-_23a915ee._.js)

</details>

---

### Accessibility

_2 error(s), 5 warning(s)_

#### Label Content Name Mismatch **[ERROR]**

`a11y/label-content-name-mismatch`

> Checks that visible label text is part of accessible name

**Solution:**

For controls with visible labels, the accessible name should contain the visible text. Voice control users say what they see - if the accessible name doesn't include the visible label, voice commands won't work. Example: A button showing 'Search' should not have aria-label='Find products'.

| Check                       | Status | Message                                                       |
| --------------------------- | ------ | ------------------------------------------------------------- |
| label-content-name-mismatch | X fail | 1 element(s) where visible text doesn't match accessible name |

<details><summary><strong>label-content-name-mismatch:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>label-content-name-mismatch:</strong> 1 item(s)</summary>

- button: visible="🇺🇸en" vs aria-label="select language"

</details>

---

#### Color Contrast **[WARN]**

`a11y/color-contrast`

> Checks for color contrast issues in styles and classes

**Solution:**

Text must have sufficient contrast with its background for readability. WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold). Use tools like WebAIM Contrast Checker to verify. Common issues: light gray text, text over images without overlay. Don't rely on color alone to convey information - add icons or text labels.

| Check          | Status | Message                             |
| -------------- | ------ | ----------------------------------- |
| color-contrast | ! warn | 7 potential color contrast issue(s) |

<details><summary><strong>color-contrast:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>color-contrast:</strong> 10 item(s)</summary>

- p with class "text-sm font-medium text-muted..." may have low contrast
- p with class "text-sm text-muted-foreground..." may have low contrast
- a with class "text-muted-foreground hover:te..." may have low contrast
- p with class "text-xl md:text-2xl text-muted..." may have low contrast
- p with class "text-muted-foreground/80 leadi..." may have low contrast
- White text (verify background): 1 instance(s)
- Very light text color: 1 instance(s)
- input with class "file:text-foreground placehold..." may have low contrast
- button with class "absolute right-3 top-1/2 -tran..." may have low contrast
- button with class "inline-flex items-center justi..." may have low contrast

</details>

---

#### Heading Order **[WARN]**

`a11y/heading-order`

> Checks that heading levels don't skip

**Solution:**

Headings should follow a logical hierarchy without skipping levels. Screen reader users navigate by headings, so skipping from H1 to H3 is confusing. Correct order: H1 -> H2 -> H3 (not H1 -> H3). You can have multiple headings at the same level, and you can go back up (H3 -> H2 is fine). Think of headings as an outline - they should make sense when read alone.

| Check         | Status | Message                          |
| ------------- | ------ | -------------------------------- |
| heading-order | ! warn | 1 heading level skip(s) detected |

<details><summary><strong>heading-order:</strong> 1 page(s) affected</summary>

- [/](http://localhost:3000/)

</details>

<details><summary><strong>heading-order:</strong> 1 item(s)</summary>

- H3 after H1

</details>

---

#### Link Text **[WARN]**

`a11y/link-text`

> Checks for descriptive link text

**Solution:**

Link text should describe the destination, not generic phrases like 'click here'. Screen reader users often navigate by links, hearing them out of context. Good: 'View our pricing plans'. Bad: 'Click here'. For icon-only links, add aria-label: <a href='/search' aria-label='Search'><svg>...</svg></a>. Empty links are especially problematic - add text or aria-label.

| Check             | Status | Message                     |
| ----------------- | ------ | --------------------------- |
| link-text-generic | ! warn | 1 link(s) with generic text |

<details><summary><strong>link-text-generic:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>link-text-generic:</strong> 1 item(s)</summary>

- login

</details>

---

### Core SEO

_2 error(s), 5 warning(s)_

#### Meta Title **[ERROR]**

`core/meta-title`

> Validates page title presence and length

**Solution:**

Every page needs a unique, descriptive title tag between 30-60 characters. Titles appear in browser tabs, search results, and social shares. Write titles that accurately describe the page content while including your primary keyword near the beginning. If your title is too short, add more descriptive context. If too long, prioritize the most important information first and trim secondary details. Avoid keyword stuffing or duplicate titles across pages.

| Check      | Status | Message                            |
| ---------- | ------ | ---------------------------------- |
| meta-title | ! warn | Title too short (18 chars, min 30) |

<details><summary><strong>meta-title:</strong> 1 page(s) affected</summary>

- [/login](http://localhost:3000/login)

</details>

---

#### Meta Description **[ERROR]**

`core/meta-description`

> Validates meta description presence and length

**Solution:**

Meta descriptions should be 120-160 characters and provide a compelling summary of the page. While not a direct ranking factor, good descriptions improve click-through rates from search results. Write unique descriptions for each page that accurately preview the content. Include a call-to-action when appropriate. If missing, search engines will auto-generate snippets which may not represent your page optimally.

| Check            | Status | Message                                   |
| ---------------- | ------ | ----------------------------------------- |
| meta-description | ! warn | Description too short (69 chars, min 120) |

<details><summary><strong>meta-description:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

---

#### Charset **[WARN]**

`core/charset`

> Checks for proper character encoding declaration

**Solution:**

Add <meta charset="UTF-8"> as the first element in your <head> section. This tells browsers how to interpret the text on your page. UTF-8 is the standard encoding that supports all languages and special characters. Placing it first ensures browsers know the encoding before parsing any other content.

| Check   | Status | Message                      |
| ------- | ------ | ---------------------------- |
| charset | X fail | No charset declaration found |

<details><summary><strong>charset:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

---

#### Open Graph Tags **[WARN]**

`core/og-tags`

> Validates Open Graph meta tags for social sharing

**Solution:**

Open Graph tags control how your content appears when shared on Facebook, LinkedIn, and other platforms. Required tags: og:title, og:description, og:image, og:url, and og:type. Add OG tags in your page head. Use images at least 1200x630 pixels for best display. Keep og:title under 60 characters and og:description under 200. Test shares using Facebook's Sharing Debugger tool.

| Check    | Status | Message                                            |
| -------- | ------ | -------------------------------------------------- |
| og-image | ! warn | Missing og:image - social shares will lack imagery |

<details><summary><strong>og-image:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>og-image:</strong> 2 item(s)</summary>

- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/login](http://localhost:3000/login)

</details>

---

### E-E-A-T

_0 error(s), 5 warning(s)_

#### About Page **[WARN]**

`eeat/about-page`

> Checks for an about/company page with content

**Solution:**

An About page establishes credibility and trust. Include company history, mission, team overview, and credentials. Link from main navigation or footer. For E-E-A-T, explain your expertise and why visitors should trust you. Include contact information and physical location if applicable.

| Check      | Status | Message             |
| ---------- | ------ | ------------------- |
| about-page | ! warn | No About page found |

<details><summary><strong>about-page:</strong> Details</summary>

```
Create /about or /about-us page
```

</details>

---

#### Author Bylines **[WARN]**

`eeat/author-byline`

> Checks for visible author names on content pages

**Solution:**

Author bylines demonstrate experience and accountability. Show author names prominently on articles, blog posts, and expert content. Include author credentials where relevant. Link author names to bio pages. For YMYL content (health, finance), author transparency is especially important for Google's E-E-A-T assessment.

| Check         | Status | Message                                          |
| ------------- | ------ | ------------------------------------------------ |
| author-byline | ! warn | Only 0% of content pages have author attribution |

<details><summary><strong>author-byline:</strong> Details</summary>

```
Add author bylines to build E-E-A-T
```

</details>

---

#### Contact Page **[WARN]**

`eeat/contact-page`

> Checks for contact page with multiple contact methods

**Solution:**

A contact page with multiple contact methods builds trust. Include: email address or contact form, phone number (if applicable), physical address, and social media links. Make contact information easy to find from any page. For local businesses, include business hours. Response time expectations are also helpful.

| Check        | Status | Message               |
| ------------ | ------ | --------------------- |
| contact-page | ! warn | No Contact page found |

<details><summary><strong>contact-page:</strong> Details</summary>

```
Create /contact page
```

</details>

---

#### Privacy Policy **[WARN]**

`eeat/privacy-policy`

> Checks for privacy policy page linked from footer

**Solution:**

A privacy policy is required by law in many jurisdictions (GDPR, CCPA) and signals trustworthiness. Link it from your footer on every page. Cover: what data you collect, how you use it, third-party sharing, user rights, and contact for privacy concerns. Keep it updated when practices change.

| Check          | Status | Message                      |
| -------------- | ------ | ---------------------------- |
| privacy-policy | ! warn | No Privacy Policy page found |

<details><summary><strong>privacy-policy:</strong> Details</summary>

```
Create /privacy-policy page
```

</details>

---

#### Content Dates **[WARN]**

`eeat/content-dates`

> Checks for published and modified dates on content

**Solution:**

Visible dates show content freshness and help users assess relevance. Include datePublished and dateModified in Article schema. Show human-readable dates on pages. Update dateModified when making significant changes. Fresh content signals ongoing maintenance and expertise. Stale dates may hurt rankings for time-sensitive topics.

| Check          | Status | Message                              |
| -------------- | ------ | ------------------------------------ |
| date-published | ! warn | Only 0% of content has datePublished |

<details><summary><strong>date-published:</strong> Details</summary>

```
Add dates to Article schema
```

</details>

---

### Security

_2 error(s), 3 warning(s)_

#### HTTPS **[ERROR]**

`security/https`

> Checks for HTTPS usage

**Solution:**

HTTPS encrypts data between users and your server, protecting sensitive information. It's a ranking signal and required for many modern browser features. Migrate to HTTPS by obtaining an SSL certificate (free from Let's Encrypt). Update internal links to use https://. Set up 301 redirects from HTTP to HTTPS. Update your canonical URLs and sitemap. Check for mixed content warnings after migration.

| Check | Status | Message                    |
| ----- | ------ | -------------------------- |
| https | X fail | Page not served over HTTPS |

<details><summary><strong>https:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

---

#### Content Security Policy **[WARN]**

`security/csp`

> Checks for Content-Security-Policy header and validates directives

**Solution:**

CSP prevents XSS attacks by restricting which resources can load. Start with a report-only policy to identify issues. Key directives: default-src 'self', script-src (avoid 'unsafe-inline'), img-src, style-src, frame-ancestors. Use nonces or hashes instead of 'unsafe-inline' for scripts. Test thoroughly as strict CSP can break functionality.

| Check       | Status | Message                           |
| ----------- | ------ | --------------------------------- |
| csp-missing | ! warn | No Content-Security-Policy header |

<details><summary><strong>csp-missing:</strong> Details</summary>

```
Site vulnerable to XSS without CSP
```

</details>

---

#### External Link Security **[WARN]**

`security/new-tab`

> Checks external target=\_blank links for noopener (security) and noreferrer (privacy)

**Solution:**

External links with target="\_blank" should include rel="noopener noreferrer". noopener prevents the opened page from accessing window.opener (tab-nabbing attacks). noreferrer prevents leaking the referrer URL to the destination site (privacy). Modern browsers default noopener for target="\_blank", but explicit attributes ensure compatibility.

| Check    | Status | Message                                   |
| -------- | ------ | ----------------------------------------- |
| noopener | ! warn | 2 external link(s) missing rel="noopener" |
| noopener | ! warn | 1 external link(s) missing rel="noopener" |

<details><summary><strong>noopener:</strong> 1 page(s) affected</summary>

- [/](http://localhost:3000/)

</details>

<details><summary><strong>noopener:</strong> 2 item(s)</summary>

- [https://github.com/Den3112/Arctic-web](https://github.com/Den3112/Arctic-web)
- [https://github.com/Den3112/Arctic-web](https://github.com/Den3112/Arctic-web)

</details>

<details><summary><strong>noopener:</strong> 1 page(s) affected</summary>

- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>noopener:</strong> 1 item(s)</summary>

- [https://github.com/Den3112/Arctic-web](https://github.com/Den3112/Arctic-web)

</details>

---

### Crawlability

_1 error(s), 3 warning(s)_

#### Sitemap Domain **[ERROR]**

`crawl/sitemap-domain`

> Checks that all sitemap URLs belong to the expected domain

**Solution:**

All URLs in your sitemap should point to pages on your own domain. Cross-domain URLs in sitemaps are a configuration error - search engines will ignore URLs that don't match the sitemap's domain. Remove external URLs from your sitemap or fix the domain in URLs if they're incorrectly formatted.

| Check          | Status | Message                               |
| -------------- | ------ | ------------------------------------- |
| sitemap-domain | X fail | 2 URL(s) point to different domain(s) |

<details><summary><strong>sitemap-domain:</strong> 2 item(s)</summary>

- [https://arctictime.vercel.app](https://arctictime.vercel.app)
- [https://arctictime.vercel.app/login](https://arctictime.vercel.app/login)

</details>

---

#### 4XX Pages in Sitemap **[WARN]**

`crawl/sitemap-4xx`

> Checks for sitemap URLs returning 4XX status codes

**Solution:**

Sitemaps should only list URLs that return 200 and are intended for indexing. Remove 4XX URLs from the sitemap or fix them by restoring the content or redirecting to a valid page. Keep sitemap entries clean to avoid wasting crawl budget.

| Check       | Status | Message                     |
| ----------- | ------ | --------------------------- |
| sitemap-4xx | ! warn | 2 sitemap URL(s) return 4XX |

<details><summary><strong>sitemap-4xx:</strong> 2 item(s)</summary>

- [https://arctictime.vercel.app](https://arctictime.vercel.app)
- [https://arctictime.vercel.app/login](https://arctictime.vercel.app/login)

</details>

---

#### Sitemap Coverage **[WARN]**

`crawl/sitemap-coverage`

> Checks for indexable pages that are not in the sitemap

**Solution:**

Your sitemap should include all pages you want search engines to index. Pages that are crawlable and indexable (no noindex, not blocked by robots.txt) should generally be in your sitemap. Missing pages may not be discovered or indexed efficiently. Use a sitemap generator that automatically includes all indexable pages, or manually add important pages.

| Check            | Status | Message                                   |
| ---------------- | ------ | ----------------------------------------- |
| sitemap-coverage | ! warn | 2 indexable page(s) not in sitemap (100%) |
| sitemap-orphans  | ! warn | 2 sitemap URL(s) were not crawled         |

<details><summary><strong>sitemap-coverage:</strong> 2 item(s)</summary>

- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/login](http://localhost:3000/login)

</details>

<details><summary><strong>sitemap-orphans:</strong> 2 item(s)</summary>

- [https://arctictime.vercel.app](https://arctictime.vercel.app)
- [https://arctictime.vercel.app/login](https://arctictime.vercel.app/login)

</details>

---

### Content

_0 error(s), 3 warning(s)_

#### Heading Hierarchy **[WARN]**

`content/heading-hierarchy`

> Validates heading structure and hierarchy

**Solution:**

Proper heading structure (H1 → H2 → H3) helps users and search engines understand your content organization. Skipping levels (H1 → H3) creates confusion. Use headings in sequential order without skipping levels. Each section should use the next heading level down. Think of headings as an outline—they should make sense when read alone. Avoid empty headings or using headings purely for styling.

| Check             | Status | Message                         |
| ----------------- | ------ | ------------------------------- |
| heading-hierarchy | ! warn | Skipped heading levels detected |

<details><summary><strong>heading-hierarchy:</strong> 1 page(s) affected</summary>

- [/](http://localhost:3000/)

</details>

<details><summary><strong>heading-hierarchy:</strong> 1 item(s)</summary>

- H1 -> H3

</details>

---

#### Word Count **[WARN]**

`content/word-count`

> Checks content length for thin content issues

**Solution:**

Pages with thin content (under 300 words) often struggle to rank well. Search engines prefer comprehensive content that thoroughly covers a topic. Add more valuable, relevant content to thin pages. Aim for at least 500 words for standard pages and 1000+ for in-depth articles. Focus on quality over quantity—padding with fluff hurts user experience. Consider consolidating multiple thin pages into one comprehensive resource.

| Check      | Status | Message                          |
| ---------- | ------ | -------------------------------- |
| word-count | ! warn | Thin content: 52 words (min 300) |
| word-count | ! warn | Thin content: 11 words (min 300) |

<details><summary><strong>word-count:</strong> 1 page(s) affected</summary>

- [/](http://localhost:3000/)

</details>

<details><summary><strong>word-count:</strong> 1 page(s) affected</summary>

- [/login](http://localhost:3000/login)

</details>

---

### Legal Compliance

_0 error(s), 2 warning(s)_

#### Privacy Policy **[WARN]**

`legal/privacy-policy`

> Checks for privacy policy link presence

**Solution:**

A privacy policy is legally required in many jurisdictions (GDPR, CCPA). Link to your privacy policy from every page, typically in the footer. The policy should explain what data you collect, how it's used, and user rights. Consider using schema.org markup to identify the policy page.

| Check          | Status | Message                      |
| -------------- | ------ | ---------------------------- |
| privacy-policy | ! warn | No privacy policy link found |

<details><summary><strong>privacy-policy:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

---

### Links

_0 error(s), 2 warning(s)_

#### Anchor Text **[WARN]**

`links/anchor-text`

> Checks for empty or generic anchor text

**Solution:**

Descriptive anchor text helps users and search engines understand link destinations. Avoid generic text like 'click here' or 'read more'. Use natural language that describes the target page. For accessibility, anchor text should make sense out of context. Avoid overly long anchor text or keyword stuffing.

| Check        | Status | Message                          |
| ------------ | ------ | -------------------------------- |
| empty-anchor | ! warn | 1 link(s) have empty anchor text |

<details><summary><strong>empty-anchor:</strong> 2 page(s) affected</summary>

- [/](http://localhost:3000/)
- [/login](http://localhost:3000/login)

</details>

<details><summary><strong>empty-anchor:</strong> 1 item(s)</summary>

- [https://github.com/Den3112/Arctic-web](https://github.com/Den3112/Arctic-web)

</details>

---

---

_Generated by [squirrelscan](https://squirrelscan.com) v0.0.31_
