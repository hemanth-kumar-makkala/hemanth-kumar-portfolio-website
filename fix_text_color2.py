import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Process the file
output_lines = []
for i, line in enumerate(lines):
    # Check if this line has an arrow span followed by a text span
    if '→</span>' in line and i + 1 < len(lines):
        # Check next line for opening span tag without style
        next_line = lines[i + 1]
        if '<span>' in next_line and 'style=' not in next_line and '<strong>' in next_line:
            # Add the line with arrow
            output_lines.append(line)
            # Modify the next line to add white color
            modified_line = next_line.replace('<span>', '<span style="color: var(--white-2);">')
            output_lines.append(modified_line)
            # Skip the next line in main loop
            lines[i + 1] = None
            continue
    
    if line is not None:
        output_lines.append(line)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines([line for line in output_lines if line is not None])

print("Fixed! Added white color to text spans.")
