// Test script to check simulation status
const http = require('http');

async function checkSimulationStatus() {
    console.log('🔍 Checking simulation status...');
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/simulation/status',
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
                console.log('\n📊 Simulation Status Report:');
                console.log('============================');
                console.log(`🚀 Active Simulations: ${response.data.activeSimulations}`);
                console.log(`📱 Running QRs: ${response.data.runningQRs.join(', ') || 'None'}`);
                console.log(`🔧 Service Initialized: ${response.data.isInitialized}`);
                
                console.log('\n📋 QR Codes Status:');
                response.data.qrCodes.forEach((qr, index) => {
                    console.log(`${index + 1}. QR: ${qr.qrId} (${qr.referenceName})`);
                    console.log(`   Status: ${qr.status}`);
                    console.log(`   Simulation Active (DB): ${qr.simulationActive}`);
                    console.log(`   Simulation Running (Memory): ${qr.isRunning}`);
                    console.log('   ---');
                });
                
                // If simulation should be running but isn't, suggest solution
                const shouldBeRunning = response.data.qrCodes.filter(qr => 
                    qr.status === 'Active' && qr.simulationActive && !qr.isRunning
                );
                
                if (shouldBeRunning.length > 0) {
                    console.log('\n⚠️  ISSUE DETECTED:');
                    console.log(`${shouldBeRunning.length} QR code(s) have simulationActive=true but are not running in memory:`);
                    shouldBeRunning.forEach(qr => console.log(`   - ${qr.qrId} (${qr.referenceName})`));
                    console.log('\n🔧 SOLUTION: Restart the backend server to reinitialize simulations.');
                }
                
            } catch (error) {
                console.error('❌ Error parsing response:', error);
                console.log('📄 Raw response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request failed:', error.message);
        console.log('💡 Make sure your backend server is running on port 5000');
    });

    req.end();
}

async function checkRecentTransactions() {
    console.log('\n🔍 Checking recent transactions...');
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/transactions?limit=10',
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
                const transactions = response.data.transactions || response.data || [];
                
                console.log(`\n📊 Recent Transactions (${transactions.length}):`);
                console.log('===============================');
                
                if (transactions.length === 0) {
                    console.log('❌ No transactions found');
                } else {
                    transactions.forEach((txn, index) => {
                        const date = new Date(txn.timestamp);
                        const timeAgo = Math.round((Date.now() - date.getTime()) / 1000 / 60);
                        console.log(`${index + 1}. ${txn.paymentId} - QR: ${txn.qrId}`);
                        console.log(`   Amount: ₹${txn.amount} | Status: ${txn.status}`);
                        console.log(`   Time: ${date.toLocaleString()} (${timeAgo} min ago)`);
                        console.log('   ---');
                    });
                }
            } catch (error) {
                console.error('❌ Error parsing transactions response:', error);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Transactions request failed:', error.message);
    });

    req.end();
}

// Run the checks
checkSimulationStatus();
setTimeout(() => checkRecentTransactions(), 1000);
