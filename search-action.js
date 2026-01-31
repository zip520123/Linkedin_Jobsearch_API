const fs = require('fs');
const path = require('path');
const linkedIn = require('linkedin-jobs-api');

// Helper class (copied/adapted from search-jobs-cv.js)
class CVBasedJobSearch {
  constructor(config) {
    this.config = config;
    this.uniqueJobs = new Map();
  }

  async searchWithConfig(searchConfig) {
    console.log(`\n🔍 Searching: ${searchConfig.name}`);
    console.log(`   Keyword: "${searchConfig.keyword}"`);
    console.log(`   Location: ${searchConfig.location}`);

    try {
      const jobs = await linkedIn.query(searchConfig);
      console.log(`   ✅ Found ${jobs.length} jobs`);
      return jobs;
    } catch (error) {
      console.error(`   ❌ Search failed: ${error.message}`);
      return [];
    }
  }

  filterJobs(jobs, filters) {
    return jobs.filter(job => {
      // Filter by title keywords
      if (filters.titleKeywords && filters.titleKeywords.length > 0) {
        const hasKeyword = filters.titleKeywords.some(keyword =>
          job.position.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }

      // Exclude companies
      if (filters.excludeCompanies && filters.excludeCompanies.length > 0) {
        const isExcluded = filters.excludeCompanies.some(company =>
          job.company.toLowerCase().includes(company.toLowerCase())
        );
        if (isExcluded) return false;
      }

      // Filter by minimum salary (if available)
      if (filters.minSalary && filters.minSalary > 0 && job.salary) {
        const salaryNum = parseInt(job.salary.replace(/\D/g, ''));
        if (salaryNum < filters.minSalary) return false;
      }

      return true;
    });
  }

  scoreJob(job, preferredKeywords) {
    if (!preferredKeywords || preferredKeywords.length === 0) return 0;

    const text = `${job.position} ${job.company}`.toLowerCase();
    return preferredKeywords.reduce((score, keyword) => {
      return text.includes(keyword.toLowerCase()) ? score + 1 : score;
    }, 0);
  }

  addUniqueJobs(jobs) {
    jobs.forEach(job => {
      if (!this.uniqueJobs.has(job.jobUrl)) {
        this.uniqueJobs.set(job.jobUrl, job);
      }
    });
  }

  async runAllSearches() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 Job Search Action');
    console.log('═══════════════════════════════════════════════════════');
    
    // Run all searches
    for (const searchConfig of this.config.searches) {
      const jobs = await this.searchWithConfig(searchConfig);
      const filtered = this.filterJobs(jobs, this.config.filters);
      this.addUniqueJobs(filtered);
      
      // Delay to be nice
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const uniqueJobsList = Array.from(this.uniqueJobs.values());

    const scoredJobs = uniqueJobsList.map(job => ({
      ...job,
      relevanceScore: this.scoreJob(job, this.config.filters.preferredKeywords)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredJobs;
  }

  async saveResults(jobs) {
    // Ensure docs/data exists
    const dataDir = path.join(__dirname, 'docs', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save JSON for the frontend
    const result = {
      generatedAt: new Date().toISOString(),
      totalJobs: jobs.length,
      jobs: jobs
    };

    fs.writeFileSync(path.join(dataDir, 'latest.json'), JSON.stringify(result, null, 2));
    
    // Save CSV for download
    const header = 'Position,Company,Location,Posted Date,Application URL,Score\n';
    const rows = jobs.map(job => {
      const escape = (field) => {
        if (!field) return '';
        const str = String(field);
        return (str.includes(',') || str.includes('"')) ? `"${str.replace(/"/g, '""')}"` : str;
      };
      return [
        escape(job.position),
        escape(job.company),
        escape(job.location),
        escape(job.agoTime || job.date),
        escape(job.jobUrl),
        job.relevanceScore
      ].join(',');
    }).join('\n');
    
    fs.writeFileSync(path.join(dataDir, 'latest.csv'), header + rows);
    console.log(`Saved ${jobs.length} jobs to docs/data/latest.json and .csv`);
  }
}

// Main execution
async function main() {
  const configJson = process.env.SEARCH_CONFIG;
  if (!configJson) {
    console.error("Error: SEARCH_CONFIG environment variable is missing.");
    process.exit(1);
  }

  try {
    const config = JSON.parse(configJson);
    const search = new CVBasedJobSearch(config);
    const jobs = await search.runAllSearches();
    await search.saveResults(jobs);
  } catch (err) {
    console.error("Execution failed:", err);
    process.exit(1);
  }
}

main();
