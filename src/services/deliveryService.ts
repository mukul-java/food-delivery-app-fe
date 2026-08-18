import api from "./api";

export interface DeliveryResponse {
  success: boolean;
  message: string;
  data: {
    deliveryId: string;
    orderId: string;
    assignedRiderId: number;
    riderName: string;
    deliveryStatus: string;
    estimatedTimeMinutes: number;
  };
}

export const deliveryService = {
  async deliverOrder(orderId: string): Promise<DeliveryResponse> {
    const response = await api.post<DeliveryResponse>(`/delivery/${orderId}`);
    return response.data;
  },
};
