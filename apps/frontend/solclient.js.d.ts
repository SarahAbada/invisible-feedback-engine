declare module 'solclientjs' {
  export interface SolclientFactoryProfiles {
    version10: any;
  }

  export interface SessionProperties {
    url: string;
    vpnName: string;
    userName: string;
    password: string;
  }

  export interface Message {
    getBinaryAttachment(): string | null;
    getDestination(): { getName(): string };
  }

  export interface Session {
    connect(): void;
    disconnect(): void;
    on(event: any, handler: (message: any) => void): void;
    subscribe(topic: any, requestConfirmation: boolean, correlationKey: any, requestTimeout: number): void;
    EVENT_CODE: {
      MESSAGE: any;
      [key: string]: any;
    };
  }

  export interface SolclientFactory {
    init(config: { profile: any }): void;
    createSession(properties: SessionProperties): Session;
    SolclientFactoryProfiles: SolclientFactoryProfiles;
  }

  const solace: {
    SolclientFactory: SolclientFactory;
  };

  export default solace;
}