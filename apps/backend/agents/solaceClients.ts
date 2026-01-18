import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const solace = require('solclientjs');

const { SolclientFactory, SolclientFactoryProfiles, SessionEventCode, MessageDeliveryModeType } = solace;

let session: any = null;
let isConnected = false;
const handlers: Map<string, (msg: any) => void> = new Map();
const pendingSubscriptions: Array<() => void> = [];

let connectionPromise: Promise<any> | null = null;

export function connectSolace() {
  if (connectionPromise) return connectionPromise;
  
  connectionPromise = new Promise((resolve, reject) => {
    if (session && isConnected) {
      resolve(session);
      return;
    }

    SolclientFactory.init({ profile: SolclientFactoryProfiles.version10 });

    session = SolclientFactory.createSession({
      url: process.env.SOLACE_URL!,
      vpnName: process.env.SOLACE_VPN!,
      userName: process.env.SOLACE_USERNAME!,
      password: process.env.SOLACE_PASSWORD!,
    });

    session.on(SessionEventCode.UP_NOTICE, () => {
      console.log('[Solace] Connected to broker');
      isConnected = true;
      pendingSubscriptions.forEach(fn => fn());
      pendingSubscriptions.length = 0;
      resolve(session);
    });

    session.on(SessionEventCode.MESSAGE, (msg: any) => {
      const topic = msg.getDestination()?.getName();
      if (!topic) return;
      const handler = handlers.get(topic);
      if (!handler) return;
      let data: any = {};
      try { data = JSON.parse(msg.getBinaryAttachment()?.toString() || '{}'); } 
      catch (err) { console.warn('[Solace] Failed to parse message', err); return; }
      handler(data);
    });

    session.on(SessionEventCode.CONNECT_FAILED_ERROR, (err: any) => {
      console.error('[Solace] Connection failed', err);
      reject(err);
    });

    session.on(SessionEventCode.DISCONNECTED, () => {
      console.warn('[Solace] Disconnected');
      isConnected = false;
    });

    session.connect();
  });

  return connectionPromise;
}

export function publish(topic: string, payload: any) {
  if (!session || !isConnected) {
    console.warn(`[Solace] Cannot publish to ${topic}: session not connected`);
    return;
  }
  const message = SolclientFactory.createMessage();
  message.setDestination(SolclientFactory.createTopicDestination(topic));
  message.setBinaryAttachment(Buffer.from(JSON.stringify(payload)));
  message.setDeliveryMode(MessageDeliveryModeType.DIRECT);
  session.send(message);
  console.log(`[Solace] Publish → ${topic}`, payload);
}

export function subscribe(topic: string, handler: (msg: any) => void) {
  if (!session) return;
  if (handlers.has(topic)) return;
  handlers.set(topic, handler);

  const doSubscribe = () => {
    session.subscribe(SolclientFactory.createTopicDestination(topic), true, topic, 10000);
    console.log(`[Solace] Subscribed to ${topic}`);
  };

  if (!isConnected) {
    pendingSubscriptions.push(doSubscribe);
    return;
  }

  doSubscribe();
}
