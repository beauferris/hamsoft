#!/usr/bin/env python3
"""
Download Raleway and Open Sans fonts from Google Fonts
"""
import re
import urllib.request
import os
from pathlib import Path

FONT_DIR = Path("src/assets/fonts")
FONT_DIR.mkdir(parents=True, exist_ok=True)

# User agent that requests WOFF2 format
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

CSS_URL = "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&family=Open+Sans:wght@400;700&display=swap"

print("Fetching font CSS from Google Fonts...")
req = urllib.request.Request(CSS_URL, headers={"User-Agent": UA})
with urllib.request.urlopen(req) as response:
    css_content = response.read().decode('utf-8')

# Parse @font-face rules
font_faces = re.findall(r'@font-face\s*\{[^}]+\}', css_content, re.DOTALL)

fonts_to_download = {
    "Raleway": {"400": "raleway-regular", "700": "raleway-bold"},
    "Open Sans": {"400": "open-sans-regular", "700": "open-sans-bold"}
}

for font_face in font_faces:
    # Extract font family and weight
    family_match = re.search(r"font-family:\s*['\"]([^'\"]+)['\"]", font_face)
    weight_match = re.search(r"font-weight:\s*(\d+)", font_face)
    
    if not family_match or not weight_match:
        continue
    
    family = family_match.group(1)
    weight = weight_match.group(1)
    
    if family not in fonts_to_download or weight not in fonts_to_download[family]:
        continue
    
    file_name = fonts_to_download[family][weight]
    
    # Extract WOFF2 URL
    woff2_match = re.search(r"url\(([^)]+woff2[^)]*)\)", font_face)
    woff_match = re.search(r"url\(([^)]+woff[^2][^)]*)\)", font_face)
    
    if woff2_match:
        woff2_url = woff2_match.group(1).strip("'\"")
        print(f"Downloading {file_name}.woff2...")
        try:
            req = urllib.request.Request(woff2_url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req) as response:
                with open(FONT_DIR / f"{file_name}.woff2", "wb") as f:
                    f.write(response.read())
            print(f"  ✓ Downloaded {file_name}.woff2")
        except Exception as e:
            print(f"  ✗ Error downloading {file_name}.woff2: {e}")
    
    if woff_match:
        woff_url = woff_match.group(1).strip("'\"")
        print(f"Downloading {file_name}.woff...")
        try:
            req = urllib.request.Request(woff_url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req) as response:
                with open(FONT_DIR / f"{file_name}.woff", "wb") as f:
                    f.write(response.read())
            print(f"  ✓ Downloaded {file_name}.woff")
        except Exception as e:
            print(f"  ✗ Error downloading {file_name}.woff: {e}")

print(f"\nDone! Fonts downloaded to {FONT_DIR}")
print("\nIf fonts didn't download correctly, visit:")
print("https://gwfh.mranftl.com/fonts/raleway")
print("https://gwfh.mranftl.com/fonts/open-sans")

