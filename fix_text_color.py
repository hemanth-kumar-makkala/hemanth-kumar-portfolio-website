import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all spans that contain text in the experience section
# Pattern: <span>text content with <strong>numbers</strong></span>
# We need to add style="color: var(--white-2);" to these spans

# Replace pattern for text spans after arrows in experience section
# This targets spans that come after the arrow spans
content = re.sub(
    r'(<span style="color: var\(--light-gray-70\); margin-right: 12px; flex-shrink: 0; font-weight: 600;">→</span>\s*<span>)',
    r'\1style="color: var(--white-2);">',
    content
)

# Fix the duplicate style attribute issue
content = content.replace('<span>style="color: var(--white-2);">', '<span style="color: var(--white-2);">')

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed! Added white color to text content.")
