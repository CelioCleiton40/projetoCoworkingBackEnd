
export interface User {
  id?: number | string;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Space {
  id?: number;
  name: string;
  capacity: number;
  hourly_rate: number;
  description?: string;
  amenities?: string;
  status: "available" | "maintenance" | "reserved";
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  min_stock: number;
  created_at?: string;
  updated_at?: string;
}


export interface Booking {
  id?: number;
  user_id: number;
  space_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id?: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes?: number;
  available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TokenPayload {
  id: string,
name: string,
is_admin?: boolean;
roles?: string[];
}