export interface RestaurantAddress {
  address: string;
  city: string;
  state: string;
  zipcode: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  restaurantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerInfo {
  name: string;
  email?: string;
  phone?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: RestaurantAddress;
  contactInfo: number[];
  foodItems: FoodItem[];
  rating: number;
  owner?: OwnerInfo;
  createdAt?: string;
  updatedAt?: string;
}
