// Test if portfolio page is displaying the seeded projects
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/portfolio',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Check for project titles in the HTML
const projectTitles = [
  'HealthTrack Mobile App',
  'E-Commerce Marketplace',
  'E-Commerce Marketplace Platform',
  'Financial Analytics Dashboard',
  'Wildlife Conservation Platform',
  'Creative Portfolio Builder',
  'Smart Home IoT Dashboard',
  'Educational Learning Platform'
];

    console.log('Portfolio Page Test Results:');
    console.log('============================');
    
    let foundProjects = 0;
    projectTitles.forEach(title => {
      if (data.includes(title)) {
        console.log(`✓ Found: ${title}`);
        foundProjects++;
      } else {
        console.log(`✗ Missing: ${title}`);
      }
    });

    console.log('\n' + '='.repeat(40));
    console.log(`Total: ${foundProjects}/${projectTitles.length} projects found`);
    
    if (foundProjects === 0) {
      console.log('\n⚠️  No projects found on portfolio page!');
      console.log('This indicates the portfolio data is not being rendered.');
    } else if (foundProjects < projectTitles.length) {
      console.log('\n⚠️  Some projects are missing from the portfolio page.');
    } else {
      console.log('\n✅ All portfolio projects are displaying correctly!');
    }
  });
});

req.on('error', (error) => {
  console.error('Error fetching portfolio page:', error);
});

req.end();
