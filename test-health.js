/**
 * Health Check Test for LinkedIn Jobs API
 * Tests if the API is working correctly with a simple query
 */

const linkedIn = require('linkedin-jobs-api');

async function testAPIHealth() {
  console.log('🔍 Testing LinkedIn Jobs API Health...\n');

  const startTime = Date.now();

  // Simple test query
  const testQuery = {
    keyword: 'software engineer',
    location: 'United States',
    dateSincePosted: 'past Week',
    jobType: 'full time',
    limit: '5'
  };

  try {
    console.log('Query Parameters:', JSON.stringify(testQuery, null, 2));
    console.log('\nFetching jobs...\n');

    const response = await linkedIn.query(testQuery);
    const duration = Date.now() - startTime;

    // Check if response is valid
    if (!response || !Array.isArray(response)) {
      throw new Error('Invalid response format');
    }

    // Display results
    console.log('✅ API Health Check: PASSED');
    console.log(`⏱️  Response Time: ${duration}ms`);
    console.log(`📊 Jobs Retrieved: ${response.length}`);
    console.log('\n--- Sample Job Listings ---\n');

    response.forEach((job, index) => {
      console.log(`${index + 1}. ${job.position}`);
      console.log(`   Company: ${job.company}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Posted: ${job.agoTime || job.date}`);
      console.log(`   URL: ${job.jobUrl}`);
      console.log('');
    });

    return {
      success: true,
      jobCount: response.length,
      responseTime: duration,
      jobs: response
    };

  } catch (error) {
    console.error('❌ API Health Check: FAILED');
    console.error('Error:', error.message);
    console.error('\nDetails:', error);

    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

// Run the test
testAPIHealth().then(result => {
  if (!result.success) {
    process.exit(1);
  }
});
