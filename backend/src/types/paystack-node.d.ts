declare module 'paystack-node' {
  // Basic type definitions for paystack-node
  interface PaystackOptions {
    apiKey: string;
  }

  class Paystack {
    constructor(options: PaystackOptions);
    // Add method type definitions as needed
    transaction: {
      initialize: (data: any) => Promise<any>;
      verify: (reference: string) => Promise<any>;
    };
    // Add other Paystack API methods here
  }

  export = Paystack;
}
