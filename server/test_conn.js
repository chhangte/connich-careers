const dns = require('dns');
const net = require('net');

const host = 'cluster0.yk8dvjf.mongodb.net';

console.log(`Checking connectivity to ${host}...`);

dns.resolve(host, 'SRV', (err, addresses) => {
  if (err) {
    console.error('DNS SRV resolution failed:', err);
    return;
  }
  console.log('SRV Records found:', addresses.length);
  addresses.forEach(addr => {
    console.log(`- ${addr.name}:${addr.port}`);
    const client = new net.Socket();
    client.connect(addr.port, addr.name, () => {
      console.log(`Successfully connected to ${addr.name}:${addr.port}`);
      client.destroy();
    });
    client.on('error', (err) => {
      console.error(`Failed to connect to ${addr.name}:${addr.port} - ${err.message}`);
    });
  });
});
