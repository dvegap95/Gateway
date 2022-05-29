export interface PeripheralDevice {
    uid: number;
    vendor: string;
    created: Date;
    status: ["online", "offline"];
    _id: string;
  }
  