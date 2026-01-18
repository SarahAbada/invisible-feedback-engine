// lib/solaceClient.ts
import solace from "solclientjs";

let session: any;

export function connectSolace() {
  if (session) return session;

  const factory = solace.SolclientFactory;
  factory.init({ profile: factory.SolclientFactoryProfiles.version10 });

  session = factory.createSession({
    url: process.env.NEXT_PUBLIC_SOLACE_URL!,
    vpnName: process.env.NEXT_PUBLIC_SOLACE_VPN!,
    userName: process.env.NEXT_PUBLIC_SOLACE_USERNAME!,
    password: process.env.NEXT_PUBLIC_SOLACE_PASSWORD!,
  });

  session.connect();
  return session;
}

export function subscribe(topic: string, handler: (msg: any) => void) {
  const s = session || connectSolace();
  s.on(s.EVENT_CODE.MESSAGE, (message: any) => {
    const data = JSON.parse(message.getBinaryAttachment() || "{}");
    if (message.getDestination().getName() === topic) handler(data);
  });
}
