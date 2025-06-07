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
export interface ClientSignUp {
  email: string;
  owner_name: string;
  password: string;
  phone: string;
  ipAddress?: string;
  authProvider?: string;
}
export interface Client {
  id?: string;
  email: string;
  shop_name?: string;
  owner_name: string;
  password?: string;
  phone?: string;
  address?: string;
  logo?: File | string | null;
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  googleAPI?: string;
  activeDays?: string[];
  maxDiscount: number;
  couponValidity: string;
  minOrderValue: number;
  ipAddress?: string;
  contractTime?: Date;
  authProvider?: string;
  token?: string;
  plan_id?: string;
  qr_id?: string;
  public_key?: string;
  plan_title?: string;
  coinRatio?: number;
  agent_id?: string;
  created_at?: string;
  staffId?: string;
  staffPassword?: string;
  staffStatus?: boolean;
  isActive?: boolean;
  customer_id?: string;
  activePlan?: ActivePlan[];
  shop_timings?: string[];
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
  isUsed: boolean;
  validFrom: string;
  maxDiscount: number;
  coinRatio: number;
  minOrderValue: number;
  id: string;
  Coupon: any;
  code: string;
  isValid: boolean;
  created: string;
  expires: string;
  qrData: string;
  createdAt: string;
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
  reviewDescription?: string;
  reviewImage: File | any;
  createdAt: Date;
  Reviews?: {
    id: string;
    customerId: string;
    review: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface TugoHistory {
  id: string;
  customer_id: string;
  customer_name: string;
  client_id: string;
  coin: number;
  amount: number;
  historyType: string;
  customer_code: string;
  coinRatio: number;
  createdAt: string;
  assignedBy: string;


}





// Define types for our props and data
interface DataPoint {
  [key: string]: any;
}

interface DataSeries {
  label: string;
  dataKey: string;
  borderColor: string;
  backgroundColor: string;
  tension?: number;
  hoverBackgroundColor?: string;
  fill?: boolean;
  borderWidth?: number;
  borderRadius?: number;
}



export interface DataPointProps {
  data: DataPoint[];
  xAxisKey: string;
  series: DataSeries[];
  title: string;
  height?: string;
  darkMode?: boolean;
}