// Real-time transaction monitoring script
const http = require('http');

let lastTransactionId = null;
let transactionCount = 0;
let startTime = Date.now();

async function getLatestTransaction() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/transactions?limit=1',
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
                    resolve(transactions[0] || null);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

async function monitorTransactions() {
    console.log('🔄 Starting real-time transaction monitoring...');
    console.log('⏰ Expected: 1 transaction every 5 seconds');
    console.log('📊 Monitoring for 60 seconds...\n');

    const interval = setInterval(async () => {
        try {
            const latestTransaction = await getLatestTransaction();
            
            if (latestTransaction) {
                if (lastTransactionId !== latestTransaction.paymentId) {
                    // New transaction detected
                    transactionCount++;
                    lastTransactionId = latestTransaction.paymentId;
                    
                    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
                    const rate = (transactionCount / elapsedTime * 60).toFixed(1);
                    
                    console.log(`🎉 NEW TRANSACTION #${transactionCount}:`);
                    console.log(`   ID: ${latestTransaction.paymentId}`);
                    console.log(`   QR: ${latestTransaction.qrId}`);
                    console.log(`   Amount: ₹${latestTransaction.amount}`);
                    console.log(`   Status: ${latestTransaction.status}`);
                    console.log(`   Time: ${new Date(latestTransaction.timestamp).toLocaleTimeString()}`);
                    console.log(`   Rate: ${rate} transactions/minute`);
                    console.log('   ---');
                }
            }
        } catch (error) {
            console.error('❌ Error checking transactions:', error.message);
        }
    }, 2000); // Check every 2 seconds

    // Stop monitoring after 60 seconds
    setTimeout(() => {
        clearInterval(interval);
        const elapsedTime = Math.round((Date.now() - startTime) / 1000);
        const actualRate = (transactionCount / elapsedTime * 60).toFixed(1);
        
        console.log('\n📊 MONITORING COMPLETE:');
        console.log('=======================');
        console.log(`⏱️  Duration: ${elapsedTime} seconds`);
        console.log(`📈 Total Transactions: ${transactionCount}`);
        console.log(`📊 Actual Rate: ${actualRate} transactions/minute`);
        console.log(`🎯 Expected Rate: 12 transactions/minute`);
        console.log(`📉 Performance: ${(actualRate / 12 * 100).toFixed(1)}% of expected`);
        
        if (actualRate < 6) {
            console.log('\n⚠️  LOW TRANSACTION RATE DETECTED!');
            console.log('🔧 Possible solutions:');
            console.log('   1. Check backend logs for errors');
            console.log('   2. Restart the backend server');
            console.log('   3. Check database connection');
            console.log('   4. Monitor server resources');
        }
    }, 60000);
}

// Initialize monitoring
getLatestTransaction().then(transaction => {
    if (transaction) {
        lastTransactionId = transaction.paymentId;
        console.log(`🔍 Starting from transaction: ${transaction.paymentId}`);
    }
    monitorTransactions();
}).catch(error => {
    console.error('❌ Failed to initialize monitoring:', error);
});
