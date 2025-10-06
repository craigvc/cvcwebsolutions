# Portfolio Item Scripts

## Quick Portfolio Management Tools

### Scripts Available

#### 1. `add-portfolio-item.js`
Simple script for adding a single portfolio item with all details manually specified.

**Usage:**
```bash
node add-portfolio-item.js
```

Edit the `portfolioData` object in the file to customize the portfolio item.

---

#### 2. `add-portfolio-from-url.js`
Advanced script that can:
- Generate portfolio content automatically
- Capture screenshots (requires puppeteer: `npm install puppeteer`)
- Process multiple sites at once

**Usage:**

**Option 1 - Run with default sites:**
```bash
node add-portfolio-from-url.js
```

**Option 2 - Add a single site via command line:**
```bash
node add-portfolio-from-url.js "https://example.com" "Company Name" "Industry" "2024"
```

Parameters:
1. URL (required)
2. Title (optional, default: "Website")
3. Client Category (optional, default: "Business") 
4. Year (optional, default: current year)

**Examples:**
```bash
# Add a legal services website
node add-portfolio-from-url.js "https://lawfirm.com" "Smith Law Firm" "Legal Services" "2024"

# Add a healthcare website
node add-portfolio-from-url.js "https://clinic.com" "City Medical Center" "Healthcare" "2023"

# Add an e-commerce site
node add-portfolio-from-url.js "https://shop.com" "Fashion Store" "E-Commerce" "2024"
```

---

### Recently Added Portfolio Items

✅ **Vixen Capital Advisors**
- URL: https://vixen-capital-advisors.com/
- Category: Financial Services
- View at: http://localhost:3456/portfolio/vixen-capital-advisors

✅ **DUI Lady**
- URL: https://www.duilady.com/
- Category: Legal Services  
- View at: http://localhost:3456/portfolio/dui-lady

---

### Adding Multiple Sites at Once

Edit the `SITES` array in `add-portfolio-from-url.js`:

```javascript
const SITES = [
  {
    url: 'https://www.example1.com/',
    title: 'Example Company 1',
    clientCategory: 'Technology',
    year: '2024'
  },
  {
    url: 'https://www.example2.com/',
    title: 'Example Company 2',
    clientCategory: 'Healthcare',
    year: '2023'
  }
];
```

Then run:
```bash
node add-portfolio-from-url.js
```

---

### Screenshot Capture

To enable automatic screenshot capture:

1. Install Puppeteer:
```bash
npm install puppeteer
```

2. Run the script - screenshots will be automatically captured and saved

If Puppeteer is not installed, the script will still work but skip screenshot capture.

---

### Portfolio Item Structure

Each portfolio item includes:
- **Basic Info**: Title, subtitle, description, slug
- **Categories**: Main category + client category
- **URLs**: Live site URL
- **Long Description**: HTML-formatted case study
- **Achievements**: Key project accomplishments
- **Technologies**: Tech stack used
- **Tags**: For filtering
- **Images**: Screenshot placeholders (can be updated in admin)

---

### Tips

1. **Quick WordPress Sites**: Use the `add-portfolio-from-url.js` script for WordPress projects - it's pre-configured with appropriate content

2. **Custom Projects**: Use `add-portfolio-item.js` for more complex projects where you want full control over the content

3. **Bulk Import**: Edit the SITES array to add multiple portfolio items at once

4. **Screenshots**: After creating items, use the admin panel to fine-tune screenshot positions using the visual editor

5. **SEO**: The scripts automatically generate SEO-friendly slugs from titles

---

### Next Steps After Adding Items

1. Visit the portfolio item URL to see it live
2. Go to admin panel to:
   - Upload/adjust screenshots
   - Fine-tune positioning  
   - Edit content if needed
3. Mark items as "featured" for homepage display

---

### Common Client Categories

- **Business Services**: Consulting, Finance, Insurance
- **Healthcare**: Medical, Dental, Wellness
- **Legal Services**: Law Firms, Legal Aid
- **Technology**: Software, IT Services, SaaS
- **E-Commerce**: Online Stores, Marketplaces
- **Education**: Schools, Training, E-Learning
- **Real Estate**: Agencies, Property Management
- **Non-Profit**: Charities, Foundations
- **Creative**: Design, Photography, Arts
- **Hospitality**: Hotels, Restaurants, Travel

Use these categories for consistent organization across your portfolio.
