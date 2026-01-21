import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the styled strong tags with plain strong tags
content = content.replace('strong style="color: var(--white-2);"', 'strong')

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed! Removed color styling from strong tags.")
