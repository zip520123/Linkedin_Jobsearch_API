/**
 * CV-Based Job Search
 * Searches for jobs matching your CV profile across multiple queries
 */

const linkedIn = require('linkedin-jobs-api');
const config = require('./job-config');

class CVBasedJobSearch {
  constructor() {
    this.allJobs = [];
    this.uniqueJobs = new Map(); // Use jobUrl as unique key
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
    console.log('🎯 CV-Based Job Search');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n👤 Profile: ${config.profile.currentTitle}`);
    console.log(`📍 Location: ${config.profile.location}`);
    console.log(`💼 Experience: ${config.profile.yearsOfExperience} years`);
    console.log(`\n🔎 Running ${config.searches.length} search queries...`);

    // Run all searches
    for (const searchConfig of config.searches) {
      const jobs = await this.searchWithConfig(searchConfig);
      const filtered = this.filterJobs(jobs, config.filters);
      this.addUniqueJobs(filtered);

      // Small delay between searches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get unique jobs and score them
    const uniqueJobsList = Array.from(this.uniqueJobs.values());

    // Score and sort jobs by relevance
    const scoredJobs = uniqueJobsList.map(job => ({
      ...job,
      relevanceScore: this.scoreJob(job, config.filters.preferredKeywords)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`📊 Results Summary`);
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Total unique jobs found: ${scoredJobs.length}`);
    console.log(`\n`);

    return scoredJobs;
  }

  displayJobs(jobs, limit = null) {
    const jobsToDisplay = limit ? jobs.slice(0, limit) : jobs;

    if (jobsToDisplay.length === 0) {
      console.log('❌ No jobs found matching your criteria.\n');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`📋 Top ${jobsToDisplay.length} Job Matches`);
    console.log('═══════════════════════════════════════════════════════\n');

    jobsToDisplay.forEach((job, index) => {
      console.log(`${index + 1}. ${job.position}`);
      console.log(`   🏢 Company: ${job.company}`);
      console.log(`   📍 Location: ${job.location}`);
      console.log(`   📅 Posted: ${job.agoTime || job.date}`);
      console.log(`   🔗 Apply: ${job.jobUrl}`);
      console.log('');
    });

    if (limit && jobs.length > limit) {
      console.log(`... and ${jobs.length - limit} more jobs\n`);
    }
  }

  async saveToFile(jobs, filename = 'job-results.json') {
    const fs = require('fs');
    const data = {
      generatedAt: new Date().toISOString(),
      profile: config.profile,
      totalJobs: jobs.length,
      jobs: jobs.map(job => ({
        position: job.position,
        company: job.company,
        location: job.location,
        posted: job.agoTime || job.date,
        url: job.jobUrl
      }))
    };

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`💾 Results saved to ${filename}\n`);
  }

  async saveToCSV(jobs) {
    const fs = require('fs');
    const path = require('path');

    // Create results folder if it doesn't exist
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Generate filename with current date
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
    const filename = path.join(resultsDir, `${dateStr}_${timeStr}.csv`);

    // CSV Header
    const header = 'Position,Company,Location,Posted Date,Application URL\n';

    // CSV Rows
    const rows = jobs.map(job => {
      // Escape fields that might contain commas or quotes
      const escapeCSV = (field) => {
        if (field === null || field === undefined) return '';
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return [
        escapeCSV(job.position),
        escapeCSV(job.company),
        escapeCSV(job.location),
        escapeCSV(job.agoTime || job.date),
        escapeCSV(job.jobUrl)
      ].join(',');
    }).join('\n');

    // Write CSV file
    const csvContent = header + rows;
    fs.writeFileSync(filename, csvContent, 'utf8');

    console.log(`💾 CSV results saved to ${filename}`);
    console.log(`📊 Total jobs exported: ${jobs.length}\n`);

    return filename;
  }

  async run() {
    try {
      const jobs = await this.runAllSearches();
      this.displayJobs(jobs, 30); // Show top 30 jobs
      // await this.saveToFile(jobs);
      await this.saveToCSV(jobs); // Save to CSV with date as filename

      return jobs;
    } catch (error) {
      console.error('❌ Job search failed:', error);
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const search = new CVBasedJobSearch();
  search.run().catch(console.error);
}

module.exports = CVBasedJobSearch;
