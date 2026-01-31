/**
 * Job Search Configuration
 * Customized based on CV profile: Senior iOS Engineer with 9 years experience
 */

module.exports = {
  // Primary search configurations - will run multiple searches
  searches: [
    // London searches
    {
      name: 'Senior iOS Engineer - London',
      keyword: 'Senior iOS Engineer',
      location: 'London, United Kingdom',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },
    {
      name: 'iOS Developer - London',
      keyword: 'iOS Developer',
      location: 'London, United Kingdom',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },

    // Amsterdam searches
    {
      name: 'Senior iOS Engineer - Amsterdam',
      keyword: 'Senior iOS Engineer',
      location: 'Amsterdam, Netherlands',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },
    {
      name: 'iOS Developer - Amsterdam',
      keyword: 'iOS Developer',
      location: 'Amsterdam, Netherlands',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },

    // Copenhagen/Denmark searches
    {
      name: 'Senior iOS Engineer - Copenhagen',
      keyword: 'Senior iOS Engineer',
      location: 'Copenhagen, Denmark',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },
    {
      name: 'iOS Developer - Copenhagen',
      keyword: 'iOS Developer',
      location: 'Copenhagen, Denmark',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },

    // Stockholm/Sweden searches
    {
      name: 'Senior iOS Engineer - Stockholm',
      keyword: 'Senior iOS Engineer',
      location: 'Stockholm, Sweden',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },
    {
      name: 'iOS Developer - Stockholm',
      keyword: 'iOS Developer',
      location: 'Stockholm, Sweden',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },

    // Helsinki/Finland searches
    {
      name: 'Senior iOS Engineer - Helsinki',
      keyword: 'Senior iOS Engineer',
      location: 'Helsinki, Finland',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },
    {
      name: 'iOS Developer - Helsinki',
      keyword: 'iOS Developer',
      location: 'Helsinki, Finland',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },

    // Poland searches (commented out)
    // {
    //   name: 'Senior iOS Engineer - Poland',
    //   keyword: 'Senior iOS Engineer',
    //   location: 'Poland',
    //   dateSincePosted: '24hr',
    //   jobType: 'full time',
    //   remoteFilter: '',
    //   experienceLevel: 'senior',
    //   limit: '25',
    //   salary: ''
    // },
    // {
    //   name: 'iOS Developer - Poland',
    //   keyword: 'iOS Developer',
    //   location: 'Poland',
    //   dateSincePosted: '24hr',
    //   jobType: 'full time',
    //   remoteFilter: '',
    //   experienceLevel: 'senior',
    //   limit: '25',
    //   salary: ''
    // },
    // {
    //   name: 'Mobile Engineer - Poland',
    //   keyword: 'Mobile Engineer',
    //   location: 'Poland',
    //   dateSincePosted: '24hr',
    //   jobType: 'full time',
    //   remoteFilter: '',
    //   experienceLevel: 'senior',
    //   limit: '25',
    //   salary: ''
    // },

    // UAE searches
    {
      name: 'Senior iOS Engineer - UAE',
      keyword: 'Senior iOS Engineer',
      location: 'United Arab Emirates',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    },
    {
      name: 'iOS Developer - UAE',
      keyword: 'iOS Developer',
      location: 'United Arab Emirates',
      dateSincePosted: '24hr',
      jobType: 'full time',
      remoteFilter: '',
      experienceLevel: 'senior',
      limit: '25',
      salary: ''
    }
  ],

  // Filtering criteria
  filters: {
    // Must include at least one of these keywords in job title
    titleKeywords: [
      'ios',
      'swift',
      'swiftui',
      'uikit'
    ],

    // Exclude these companies (add any you don't want)
    excludeCompanies: [
      // Add companies to exclude, e.g., 'Company Name'
    ],

    // Preferred keywords (bonus points, not required)
    preferredKeywords: [
      'swift',
      'swiftui',
      'uikit',
      'mvvm',
      'rxswift',
      'combine',
      'tdd',
      'ci/cd',
      'fastlane',
      'senior',
      'lead',
      'architect'
    ],

    // Minimum salary (if specified)
    minSalary: 0
  },

  // Profile summary for reference
  profile: {
    yearsOfExperience: 9,
    currentTitle: 'Senior iOS Engineer',
    location: 'London, UK',
    skills: [
      'Swift',
      'Objective-C',
      'SwiftUI',
      'UIKit',
      'RxSwift',
      'MVVM',
      'VIPER',
      'TDD',
      'CI/CD',
      'Fastlane',
      'AWS',
      'Node.js',
      'React.js'
    ],
    visaStatus: 'UK Skilled Worker Visa eligible'
  }
};
