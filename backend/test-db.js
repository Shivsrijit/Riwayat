const mongoose = require('mongoose');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const pass = 'JMjmvDKHvpkNlzWJ';
const cluster = 'cluster0.e1ilsrx.mongodb.net';

const usernames = [
  'riwayat_admin', 'db_user', 'admin_user', 'cluster0user', 'srijit_shiv', 'shiv_srijit', 'shivsrijit1'
];

async function testConnections() {
  for (const user of usernames) {
    const uri = `mongodb+srv://${user}:${pass}@${cluster}/riwayat?retryWrites=true&w=majority`;
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
      console.log(`\n========================================`);
      console.log(`SUCCESS! Connected with user: ${user}`);
      console.log(`========================================\n`);
      await mongoose.disconnect();
      return user;
    } catch (e) {
      console.log(`User '${user}' failed: ${e.message}`);
    }
  }
  console.log("Finished testing username batch 2.");
}

testConnections();
