# Digital Yacht Week — assets folder

Drop project artwork into this folder. The page (`digitalyachtweek.html`)
references these filenames — replace them and they'll appear immediately.

## Expected files
- `cover.jpg` — homepage thumbnail and OG image (recommended ≥ 1200 × 800)
- `01.jpg` — hero image at top of the project page
- `02.jpg` ... `06.jpg` — additional gallery images

The placeholder `cover.svg` is currently used on the homepage and as the
fallback hero. Once you add `cover.jpg`, update the `<img src="...">` in
`digitalyachtweek.html` (search for `cover.svg`) and on `index.html`.

## Edit the copy
Body text, year, and meta descriptions are placeholders. Open
`digitalyachtweek.html` and update:
- The `<h1>` and `<h2>` (subtitle/role/year)
- The intro `<p>` paragraph
- `<title>`, `<meta name="description">`, OG and Twitter description
- The JSON-LD `description` and `genre`
