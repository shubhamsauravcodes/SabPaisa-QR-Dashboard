// Simple Node.js script to test the API directly
const https = require('https');
const http = require('http');

// Change this to your actual API endpoint
const API_BASE_URL = 'http://localhost:5000'; // or whatever your backend URL is
const API_ENDPOINT = '/api/qr'; // or the correct endpoint

function testAPI() {
    console.log('🔍 Testing API directly...');
    console.log(`📡 Calling: ${API_BASE_URL}${API_ENDPOINT}`);
    
    const options = {
        hostname: 'localhost',
        port: 5000, // Change this to your backend port
        path: '/api/qr',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('📊 Raw API Response:', JSON.stringify(response, null, 2));
                
                // Check for Sanu specifically
                const qrCodes = response.data?.qrCodes || response.data || response || [];
                console.log('🔢 Total QR codes found:', Array.isArray(qrCodes) ? qrCodes.length : 'Not an array');
                
                if (Array.isArray(qrCodes)) {
                    const sanuRecord = qrCodes.find(qr => qr.referenceName === 'Sanu');
                    if (sanuRecord) {
                        console.log('✅ Found Sanu record:', sanuRecord);
                    } else {
                        console.log('❌ Sanu record NOT found in API response');
                        console.log('📋 Available reference names:', qrCodes.map(qr => qr.referenceName));
                    }
                }
            } catch (error) {
                console.error('❌ Error parsing response:', error);
                console.log('📄 Raw response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ API request failed:', error);
    });

    req.end();
}

// Run the test
testAPI();
