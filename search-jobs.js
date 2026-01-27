/**
 * LinkedIn Jobs Search Workflow
 * Main script for searching and filtering jobs
 */

const linkedIn = require('linkedin-jobs-api');

class JobSearchWorkflow {
  constructor(config = {}) {
    this.config = {
      keyword: config.keyword || 'software engineer',
      location: config.location || 'United States',
      dateSincePosted: config.dateSincePosted || 'past Week',
      jobType: config.jobType || 'full time',
      remoteFilter: config.remoteFilter || '',
      experienceLevel: config.experienceLevel || '',
      limit: config.limit || '25',
      page: config.page || '0',
      ...config
    };
  }

  async searchJobs() {
    console.log('🔍 Searching LinkedIn Jobs...\n');
    console.log('Search Parameters:', JSON.stringify(this.config, null, 2));
    console.log('\n');

    try {
      const jobs = await linkedIn.query(this.config);
      console.log(`✅ Found ${jobs.length} jobs\n`);
      return jobs;
    } catch (error) {
      console.error('❌ Search failed:', error.message);
      throw error;
    }
  }

  filterJobs(jobs, filters = {}) {
    let filtered = [...jobs];

    // Filter by keywords in job title
    if (filters.titleKeywords && filters.titleKeywords.length > 0) {
      filtered = filtered.filter(job =>
        filters.titleKeywords.some(keyword =>
          job.position.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    // Filter by company
    if (filters.excludeCompanies && filters.excludeCompanies.length > 0) {
      filtered = filtered.filter(job =>
        !filters.excludeCompanies.some(company =>
          job.company.toLowerCase().includes(company.toLowerCase())
        )
      );
    }

    // Filter by minimum salary (if available)
    if (filters.minSalary && filters.minSalary > 0) {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const salaryNum = parseInt(job.salary.replace(/\D/g, ''));
        return salaryNum >= filters.minSalary;
      });
    }

    console.log(`📋 After filtering: ${filtered.length} jobs remaining\n`);
    return filtered;
  }

  displayJobs(jobs) {
    if (jobs.length === 0) {
      console.log('No jobs found matching criteria.\n');
      return;
    }

    console.log('=== Job Listings ===\n');

    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.position}`);
      console.log(`   🏢 Company: ${job.company}`);
      console.log(`   📍 Location: ${job.location}`);
      console.log(`   📅 Posted: ${job.agoTime || job.date}`);
      if (job.salary) {
        console.log(`   💰 Salary: ${job.salary}`);
      }
      console.log(`   🔗 Apply: ${job.jobUrl}`);
      console.log('');
    });
  }

  async run(additionalFilters = {}) {
    try {
      const jobs = await this.searchJobs();
      const filteredJobs = this.filterJobs(jobs, additionalFilters);
      this.displayJobs(filteredJobs);
      return filteredJobs;
    } catch (error) {
      console.error('Workflow failed:', error);
      throw error;
    }
  }
}

// Example usage
async function main() {
  const workflow = new JobSearchWorkflow({
    keyword: 'software engineer',
    location: 'United States',
    dateSincePosted: 'past Week',
    jobType: 'full time',
    remoteFilter: 'remote',
    experienceLevel: 'entry level',
    limit: '20'
  });

  const filters = {
    titleKeywords: ['engineer', 'developer'],
    excludeCompanies: [],
    minSalary: 0
  };

  await workflow.run(filters);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = JobSearchWorkflow;
