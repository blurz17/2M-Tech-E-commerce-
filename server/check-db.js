// server/check-db.js
const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabaseConnection() {
    try {
        console.log('🔍 Checking database connection...');
        console.log('MONGO_URI from .env:', process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI);
        
        // Get database name
        const dbName = mongoose.connection.db.databaseName;
        console.log('\n✅ Connected to MongoDB!');
        console.log('📊 Database Name:', dbName);
        console.log('🌐 Host:', mongoose.connection.host);
        console.log('🔌 Port:', mongoose.connection.port);
        console.log('📡 Connection State:', mongoose.connection.readyState);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Collections in this database:');
        if (collections.length === 0) {
            console.log('   No collections found');
        } else {
            collections.forEach((collection, index) => {
                console.log(`   ${index + 1}. ${collection.name}`);
            });
        }
        
        // Check for users collection specifically
        const usersCollection = collections.find(col => col.name === 'users');
        if (usersCollection) {
            const userCount = await mongoose.connection.db.collection('users').countDocuments();
            console.log(`\n👥 Users collection found with ${userCount} documents`);
        } else {
            console.log('\n❌ No users collection found');
        }
        
    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
    }
}

checkDatabaseConnection();