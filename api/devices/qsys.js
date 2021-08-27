import QrcClient, {commands} from 'qsys-qrc-client';

const client = new QrcClient();
client.connect({
  port: 1710,
  host: '192.168.1.10'
});

async function checkStatus() {
  // The send function returns Promises, use the await syntax for synchronous-like code flow.
  const status = await client.send(commands.getStatus());
  console.log(`${status.DesignName} is running on a ${status.Platform}`);
  //=> "My Test Design is running on a Emulator"
}
