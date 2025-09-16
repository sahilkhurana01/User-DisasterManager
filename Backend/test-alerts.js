const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:4000';

async function testAlertStatus(phone, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(phone)}/alerts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alertStatus: status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Alert status updated to ${status} for ${phone}:`, result);
    return true;
  } catch (error) {
    console.error(`❌ Error updating alert status for ${phone}:`, error.message);
    return false;
  }
}

async function getAlertStatus(phone) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(phone)}/alerts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`📊 Current alert status for ${phone}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error fetching alert status for ${phone}:`, error.message);
    return null;
  }
}

// Test function
async function runTests() {
  console.log('🚀 Starting Alert System Tests...\n');

  // Test phone number (replace with actual phone number from your app)
  const testPhone = '1234567890'; // Replace with actual phone number

  console.log('1. Getting current alert status...');
  await getAlertStatus(testPhone);

  console.log('\n2. Setting alert to RED...');
  await testAlertStatus(testPhone, 'red');

  console.log('\n3. Waiting 5 seconds...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('\n4. Getting updated alert status...');
  await getAlertStatus(testPhone);

  console.log('\n5. Setting alert to GREEN...');
  await testAlertStatus(testPhone, 'green');

  console.log('\n6. Getting final alert status...');
  await getAlertStatus(testPhone);

  console.log('\n✅ Alert system tests completed!');
  console.log('\n📱 Check your app for:');
  console.log('   - Toast notifications when alert is RED');
  console.log('   - Danger zone visualization on the map');
  console.log('   - Notifications in the notifications page');
  console.log('   - Alert status updates every 30 seconds');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAlertStatus, getAlertStatus };
