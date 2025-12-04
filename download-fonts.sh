#!/bin/bash

# Download fonts from Google Fonts in WOFF2 format
# Uses browser user agent to get WOFF2 files instead of TTF

FONT_DIR="src/assets/fonts"
mkdir -p "$FONT_DIR"

# User agent that requests WOFF2 format
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

echo "Fetching font CSS from Google Fonts..."

# Get CSS with WOFF2 support
CSS_URL="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&family=Open+Sans:wght@400;700&display=swap"
CSS_CONTENT=$(curl -s -L "$CSS_URL" -H "User-Agent: $UA")

# Save CSS to temp file for parsing
TMP_CSS=$(mktemp)
echo "$CSS_CONTENT" > "$TMP_CSS"

echo "Downloading fonts..."

# Function to extract and download font
download_font() {
  local font_name=$1
  local weight=$2
  local file_name=$3
  
  # Extract WOFF2 URL
  woff2_url=$(grep -A 10 "font-weight: $weight" "$TMP_CSS" | grep "$font_name" | grep "woff2" | head -1 | sed -n "s/.*url(\([^)]*woff2\)).*/\1/p" | tr -d "'\"")
  
  # Extract WOFF URL (fallback)
  woff_url=$(grep -A 10 "font-weight: $weight" "$TMP_CSS" | grep "$font_name" | grep -E "woff[^2]|format\('woff'\)" | head -1 | sed -n "s/.*url(\([^)]*woff[^2]*\)).*/\1/p" | tr -d "'\"")
  
  if [ ! -z "$woff2_url" ]; then
    echo "  Downloading $file_name.woff2..."
    curl -L "$woff2_url" -o "$FONT_DIR/$file_name.woff2" -H "User-Agent: $UA"
  fi
  
  if [ ! -z "$woff_url" ]; then
    echo "  Downloading $file_name.woff..."
    curl -L "$woff_url" -o "$FONT_DIR/$file_name.woff" -H "User-Agent: $UA"
  fi
}

download_font "Raleway" "400" "raleway-regular"
download_font "Raleway" "700" "raleway-bold"
download_font "Open Sans" "400" "open-sans-regular"
download_font "Open Sans" "700" "open-sans-bold"

rm "$TMP_CSS"

echo ""
echo "Done! Fonts downloaded to $FONT_DIR"
echo ""
echo "If fonts didn't download correctly, you can:"
echo "1. Visit https://gwfh.mranftl.com/fonts and download manually"
echo "2. Or use: npm install -g google-webfonts-helper-cli"
