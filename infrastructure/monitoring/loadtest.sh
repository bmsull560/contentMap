#!/bin/bash
# Load testing script for contentMap using k6

# k6 test script
cat > loadtest.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '3m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<3000'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://staging.contentmap.example.com';

export default function () {
  // Homepage
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'homepage status 200': (r) => r.status === 200,
    'homepage load time < 2s': (r) => r.timings.duration < 2000,
  });
  errorRate.add(res.status !== 200);
  responseTime.add(res.timings.duration);

  sleep(1);

  // API health check
  res = http.get(`${BASE_URL}/health`);
  check(res, {
    'health check status 200': (r) => r.status === 200,
  });
  errorRate.add(res.status !== 200);

  sleep(2);

  // Simulate user navigation
  const pages = ['/', '/showcase'];
  const randomPage = pages[Math.floor(Math.random() * pages.length)];
  res = http.get(`${BASE_URL}${randomPage}`);
  check(res, {
    'page status 200': (r) => r.status === 200,
  });
  errorRate.add(res.status !== 200);
  responseTime.add(res.timings.duration);

  sleep(3);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
EOF

# Run k6 test
echo "Starting load test..."
k6 run loadtest.js

# Cleanup
rm loadtest.js
