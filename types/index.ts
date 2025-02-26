
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  type_of_employment: string;
  profile: string;
  created_at: string;
}

export interface ActivePlan {
  client_id: string;
  createdAt: string;
  id: string;
  isActive: Boolean
  plan_id: string;
  updatedAt: string;
}
export interface Client {
  id?: string;
  email: string;
  shop_name?: string;
  owner_name: string;
  password?: string;
  phone?: string;
  address?: string;
  logo?: File | any;
  googleAPI?: string;
  maxDiscount: number;
  couponValidity: string;
  minOrderValue: number;
  ipAddress?: string;
  contractTime?: Date;
  authProvider?: "google" | "manual";
  token?: string;
  plan_id?: string;
  qr_id?: string;
  plan_title?: string;
  agent_id?: string;
  created_at?: string;
  staffId?: string;
  staffPassword?: string;
  staffStatus?: boolean;
  isActive?: boolean;
  customer_id?: string;
  activePlan?: ActivePlan[];
}

export interface QRCode {
  id: string;
  public_key: string;
  private_key: string;
  client_id: string;
  amount: number;
  status: 'active' | 'used';
  created_at: string;
}

export interface PaymentLog {
  id: string;
  qrcodeid: string;
  amount: number;
  status: 'success' | 'failed';
  date: string;
  shop_name: string;
  owner_name: string;
  email: string;
  phone: string;
}

export interface Plans {
  id: string
  title: string
  price: string
  level: Number
}


export interface Coupon {
  id: number;
  Coupon: any;
  code: string;
  isValid: boolean;
  created: string;
  expires: string;
  qrData: string;
}

export interface CustomerData {
  id: string;
  client_id: string;
  qr_id: string;
  name: string;
  couponCode: string;
  email: string;
  phone: string;
  DOB: string;
  ratings: number;
  reviewImage: File | any;

}