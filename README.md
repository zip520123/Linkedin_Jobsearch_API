# LinkedIn Jobs Auto Apply Workflow

A Node.js workflow for searching and filtering LinkedIn job listings using the [linkedin-jobs-api](https://github.com/VishwaGauravIn/linkedin-jobs-api).

## Setup

1. Install dependencies:
```bash
npm install
```

## Usage

### Health Check Test

Test if the API is working correctly:

```bash
npm test
```

This will run a simple query and display results to verify the API is functioning.

### Job Search

Run the job search workflow:

```bash
npm run search
```

Or use it directly:

```bash
node search-jobs.js
```

### Programmatic Usage

```javascript
const JobSearchWorkflow = require('./search-jobs');

const workflow = new JobSearchWorkflow({
  keyword: 'frontend developer',
  location: 'New York',
  dateSincePosted: 'past Week',
  jobType: 'full time',
  remoteFilter: 'remote',
  experienceLevel: 'mid-senior level',
  limit: '25'
});

const filters = {
  titleKeywords: ['react', 'javascript'],
  excludeCompanies: ['Company XYZ'],
  minSalary: 80000
};

const jobs = await workflow.run(filters);
```

## Configuration Options

### Search Parameters

- **keyword**: Job title or skill (e.g., "software engineer")
- **location**: Location name (e.g., "United States", "San Francisco")
- **dateSincePosted**: 'past month', 'past week', '24hr'
- **jobType**: 'full time', 'part time', 'contract', 'internship'
- **remoteFilter**: 'on site', 'remote', 'hybrid'
- **experienceLevel**: 'entry level', 'associate', 'mid-senior level', 'director', 'executive'
- **salary**: Minimum salary (40000-120000+)
- **limit**: Number of results (default: 25)
- **page**: Pagination (default: 0)

### Filter Options

- **titleKeywords**: Array of keywords that must appear in job title
- **excludeCompanies**: Array of company names to exclude
- **minSalary**: Minimum salary threshold (if salary data available)

## Files

- `package.json` - Project configuration
- `test-health.js` - API health check test
- `search-jobs.js` - Main job search workflow
- `README.md` - This file

## Export Results

Job search results are automatically saved in two formats:

1. **JSON Format**: `job-results.json` - Complete job data with metadata
2. **CSV Format**: `results/YYYY-MM-DD_HH-MM-SS.csv` - Spreadsheet-compatible format

The CSV file includes:
- Position title
- Company name
- Location
- Posted date
- Salary (if available)
- Relevance score
- Application URL

CSV files are saved in the `results/` folder with timestamps, allowing you to track searches over time and compare results.

## Next Steps

Potential enhancements:
- Email notifications for new matching jobs
- Integration with application tracking
- Automated application submission (with caution)
- Scheduled job searches (cron jobs)
- Duplicate detection across multiple searches
