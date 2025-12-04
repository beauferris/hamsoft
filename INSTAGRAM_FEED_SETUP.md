# Instagram Feed Setup Guide

## Quick Start - Three Options

### Option 1: Third-Party Widget (Easiest - Recommended)

**Using SnapWidget (Free):**

1. Go to https://snapwidget.com/
2. Sign up for a free account
3. Connect your Instagram account
4. Customize your feed design
5. Copy the embed code
6. Update the `instagram-feed.njk` component with the embed code

**Or use Juicer (Free):**

1. Go to https://www.juicer.io/
2. Sign up and add your Instagram account
3. Get your embed code
4. Replace the script in `instagram-feed.njk` with Juicer's code

### Option 2: Instagram Basic Display API (More Control)

**Setup Steps:**

1. **Create a Facebook App:**
   - Go to https://developers.facebook.com/
   - Create a new app
   - Add "Instagram Basic Display" product

2. **Get Access Token:**
   - Set up OAuth redirect URI
   - Generate a User Token (requires user login)
   - Or use a Long-Lived Token for server-side

3. **Fetch Instagram Posts:**
   - Use the API endpoint: `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=YOUR_TOKEN`
   - Store the data in an Eleventy data file or fetch at build time

4. **Update the Component:**
   - Modify `instagram-feed.njk` to use the fetched data
   - Display images and links to posts

### Option 3: Manual Embed (Simple but Manual)

1. Manually collect Instagram post URLs
2. Add them to a data file (e.g., `instagram-posts.json`)
3. The component will use Instagram's oEmbed API to display them

## Implementation Steps

### Step 1: Add Your Instagram Handle

Update `src/_data/site.json`:
```json
{
  "instagram_handle": "your_actual_handle"
}
```

### Step 2: Add the Component to Your Page

In `src/index.njk` (or any page), add:

```njk
{% include "partials/instagram-feed.njk" %}
```

### Step 3: Choose Your Implementation

- **For Option 1 (Widget):** Replace the script section in `instagram-feed.njk` with your widget provider's code
- **For Option 2 (API):** Set up the API and create a data file to fetch posts at build time
- **For Option 3 (Manual):** Create `src/_data/instagram-posts.json` with post URLs

## Recommended: Using a Third-Party Service

The easiest approach is to use a service like:
- **SnapWidget** - Free tier available
- **Juicer** - Free for basic use
- **Elfsight** - Free widget available

These handle all the API complexity and provide ready-to-use embed codes.

