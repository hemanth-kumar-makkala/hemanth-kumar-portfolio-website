# Portfolio Data Configuration

This portfolio uses a centralized JSON configuration file for easy data management.

## 📁 File Location
`data/portfolio-data.json`

## 🎯 How to Update Your Portfolio

### Quick Updates
Simply edit the `data/portfolio-data.json` file to update:

#### Personal Information
```json
"personal": {
  "fullName": "Your Full Name",
  "roles": ["Role 1", "Role 2"],
  "profileImage": "./assets/images/your-image.jpeg"
}
```

#### Contact Information
```json
"contact": {
  "email": "your.email@example.com",
  "phone": "+1234567890",
  "location": "Your City, Country"
}
```

#### Social Media Links
```json
"social": {
  "github": {
    "username": "your-github-username",
    "url": "https://github.com/your-username",
    "display": "your-github-username"
  },
  // ... other social platforms
}
```

### What Gets Auto-Updated

When you change `portfolio-data.json`, the following elements automatically update:

✅ **Name** - All instances across the site
✅ **Roles** - "AI Automation Specialist", "Tech Content Creator", etc.
✅ **Email** - Contact links and display text
✅ **Phone** - Contact links and display text
✅ **Location** - Address display
✅ **Social Links** - All GitHub, LinkedIn, YouTube, Instagram links
✅ **About Text** - Introduction and description paragraphs
✅ **Page Title** - Browser tab title

### How It Works

1. **JSON File** (`data/portfolio-data.json`) - Stores all your data
2. **Data Loader** (`assets/js/data-loader.js`) - Reads the JSON and updates HTML
3. **Automatic** - Changes reflect immediately when you refresh the page

### Example: Changing Your Email

**Before:**
```json
"contact": {
  "email": "old.email@example.com"
}
```

**After:**
```json
"contact": {
  "email": "new.email@example.com"
}
```

Save the file → Refresh the browser → Done! ✅

### Tips

- 🔧 **Easy to maintain** - One file to update everything
- 🚀 **No HTML editing** - Change JSON only
- 💾 **Backup friendly** - Keep this file backed up
- 📝 **JSON format** - Use a JSON validator if unsure about syntax

### JSON Structure Overview

```
portfolio-data.json
├── personal (name, roles, images)
├── contact (email, phone, location)
├── social (all social media links)
├── about (intro text, description)
├── services (what you do)
├── experience (work history)
├── education (academic background)
├── skills (technical & tools)
└── meta (page metadata)
```

### Need Help?

- Make sure JSON syntax is valid (check for missing commas, brackets)
- Use a JSON validator: https://jsonlint.com/
- Keep backups before making changes

---

**Last Updated:** 2026-01-22
