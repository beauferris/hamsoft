# Font Setup Instructions

I've configured your site to use self-hosted fonts. You need to download the font files.

## Quick Setup (Recommended)

1. Visit these links and download the fonts:
   - **Raleway**: https://gwfh.mranftl.com/fonts/raleway
   - **Open Sans**: https://gwfh.mranftl.com/fonts/open-sans

2. For each font, select:
   - **Raleway**: Regular (400) and Bold (700)
   - **Open Sans**: Regular (400) and Bold (700)

3. Download in **WOFF2** format (and WOFF as fallback if available)

4. Save the files to `src/assets/fonts/` with these exact names:
   - `raleway-regular.woff2`
   - `raleway-bold.woff2`
   - `open-sans-regular.woff2`
   - `open-sans-bold.woff2`
   - (Optional fallbacks: `raleway-regular.woff`, `raleway-bold.woff`, `open-sans-regular.woff`, `open-sans-bold.woff`)

## What's Already Done

✅ Added `@font-face` declarations to `src/assets/styles.css`
✅ Removed Google Fonts links from all layout files
✅ Added font preload links for faster loading
✅ Configured `font-display: swap` to prevent layout shifts

## Benefits

- **No external requests** - fonts load from your domain
- **Faster loading** - no DNS lookup for fonts.googleapis.com
- **Better privacy** - no requests to Google
- **Reduced layout shift** - fonts load with your site
- **More control** - you control caching and optimization

## After Downloading

1. Run `npm run build` to test
2. The fonts should load without any "jump" or layout shift
3. Deploy as normal

