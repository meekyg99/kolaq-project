import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

export interface GIGShipmentRequest {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderState: string;
  senderLGA: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverState: string;
  receiverLGA: string;
  itemName: string;
  itemValue: number;
  itemWeight: number;
  itemQuantity: number;
  deliveryType: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  paymentMethod: 'PREPAID' | 'POSTPAID';
}

export interface GIGShipmentResponse {
  success: boolean;
  waybillNumber: string;
  estimatedDeliveryDate: string;
  shippingCost: number;
  message?: string;
}

export interface GIGTrackingResponse {
  success: boolean;
  waybillNumber: string;
  status: string;
  location: string;
  statusHistory: Array<{
    status: string;
    location: string;
    timestamp: string;
    remarks: string;
  }>;
  estimatedDelivery: string;
}

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);
  private readonly gigApiUrl = process.env.GIG_LOGISTICS_API_URL || 'https://giglogistics.com/api/v1';
  private readonly gigApiKey = process.env.GIG_LOGISTICS_API_KEY;
  private readonly isProduction = process.env.NODE_ENV === 'production';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate shipping cost based on zone and weight
   */
  async calculateShippingCost(
    originState: string,
    destinationState: string,
    weight: number, // in kg
    deliveryType: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' = 'STANDARD',
  ): Promise<number> {
    // Lagos as default origin
    const lagosZone1 = ['Lagos'];
    const southWestZone = ['Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti'];
    const southSouthZone = ['Rivers', 'Delta', 'Edo', 'Akwa Ibom', 'Cross River', 'Bayelsa'];
    const southEastZone = ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'];
    const northCentralZone = ['FCT', 'Abuja', 'Kwara', 'Kogi', 'Nasarawa', 'Niger', 'Plateau', 'Benue'];
    const northWestZone = ['Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara', 'Jigawa'];
    const northEastZone = ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'];

    let baseRate = 0;

    // Determine zone-based rate
    if (lagosZone1.includes(destinationState)) {
      baseRate = 1500; // Within Lagos
    } else if (southWestZone.includes(destinationState)) {
      baseRate = 2500; // South West
    } else if (southSouthZone.includes(destinationState)) {
      baseRate = 3500; // South South
    } else if (southEastZone.includes(destinationState)) {
      baseRate = 3000; // South East
    } else if (northCentralZone.includes(destinationState)) {
      baseRate = 4000; // North Central
    } else if (northWestZone.includes(destinationState) || northEastZone.includes(destinationState)) {
      baseRate = 5000; // North West/East
    } else {
      baseRate = 3000; // Default
    }

    // Weight multiplier (per kg over 1kg)
    const weightCharge = weight > 1 ? (weight - 1) * 500 : 0;

    // Delivery type multiplier
    let deliveryMultiplier = 1;
    if (deliveryType === 'EXPRESS') {
      deliveryMultiplier = 1.5;
    } else if (deliveryType === 'SAME_DAY') {
      deliveryMultiplier = 2;
    }

    const totalCost = Math.round((baseRate + weightCharge) * deliveryMultiplier);

    return totalCost;
  }

  /**
   * Create shipment with GIG Logistics
   */
  async createShipment(request: GIGShipmentRequest): Promise<GIGShipmentResponse> {
    try {
      // In development/test mode, return mock data
      if (!this.isProduction || !this.gigApiKey) {
        this.logger.warn('Using mock GIG Logistics response (dev mode)');
        return this.mockCreateShipment(request);
      }

      // Call GIG Logistics API
      const response = await axios.post(
        `${this.gigApiUrl}/shipments/create`,
        {
          sender: {
            name: request.senderName,
            phone: request.senderPhone,
            address: request.senderAddress,
            state: request.senderState,
            lga: request.senderLGA,
          },
          receiver: {
            name: request.receiverName,
            phone: request.receiverPhone,
            address: request.receiverAddress,
            state: request.receiverState,
            lga: request.receiverLGA,
          },
          items: [
            {
              name: request.itemName,
              value: request.itemValue,
              weight: request.itemWeight,
              quantity: request.itemQuantity,
            },
          ],
          delivery_type: request.deliveryType,
          payment_method: request.paymentMethod,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.gigApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        waybillNumber: response.data.waybill_number,
        estimatedDeliveryDate: response.data.estimated_delivery_date,
        shippingCost: response.data.shipping_cost,
      };
    } catch (error) {
      this.logger.error('GIG Logistics shipment creation failed', error);
      
      // Fallback to mock in case of API error
      if (!this.isProduction) {
        return this.mockCreateShipment(request);
      }

      throw new BadRequestException('Failed to create shipment. Please try again.');
    }
  }

  /**
   * Track shipment with GIG Logistics
   */
  async trackShipment(waybillNumber: string): Promise<GIGTrackingResponse> {
    try {
      // In development/test mode, return mock data
      if (!this.isProduction || !this.gigApiKey) {
        this.logger.warn('Using mock GIG Logistics tracking (dev mode)');
        return this.mockTrackShipment(waybillNumber);
      }

      const response = await axios.get(
        `${this.gigApiUrl}/shipments/track/${waybillNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${this.gigApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        waybillNumber: response.data.waybill_number,
        status: response.data.status,
        location: response.data.current_location,
        statusHistory: response.data.tracking_history.map((h: any) => ({
          status: h.status,
          location: h.location,
          timestamp: h.timestamp,
          remarks: h.remarks || '',
        })),
        estimatedDelivery: response.data.estimated_delivery,
      };
    } catch (error) {
      this.logger.error('GIG Logistics tracking failed', error);

      // Fallback to mock in case of API error
      if (!this.isProduction) {
        return this.mockTrackShipment(waybillNumber);
      }

      throw new BadRequestException('Failed to track shipment. Please try again.');
    }
  }

  /**
   * Schedule pickup with GIG Logistics
   */
  async schedulePickup(orderId: string, pickupDate: Date): Promise<boolean> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      // In dev mode, just update the order
      if (!this.isProduction || !this.gigApiKey) {
        this.logger.warn('Mock pickup scheduled (dev mode)');
        return true;
      }

      const response = await axios.post(
        `${this.gigApiUrl}/pickups/schedule`,
        {
          waybill_number: order.trackingNumber,
          pickup_date: pickupDate.toISOString(),
          pickup_address: order.shippingAddress,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.gigApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.success;
    } catch (error) {
      this.logger.error('Pickup scheduling failed', error);
      return false;
    }
  }

  /**
   * Get delivery quote
   */
  async getDeliveryQuote(
    originState: string,
    destinationState: string,
    weight: number,
    deliveryType: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' = 'STANDARD',
  ): Promise<{ cost: number; estimatedDays: number }> {
    const cost = await this.calculateShippingCost(
      originState,
      destinationState,
      weight,
      deliveryType,
    );

    // Estimate delivery days based on zone
    let estimatedDays = 3; // Default
    if (originState === destinationState) {
      estimatedDays = deliveryType === 'SAME_DAY' ? 0 : 1;
    } else if (destinationState === 'Lagos') {
      estimatedDays = 2;
    } else if (['Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti'].includes(destinationState)) {
      estimatedDays = 3;
    } else {
      estimatedDays = 5;
    }

    // Adjust for delivery type
    if (deliveryType === 'EXPRESS') {
      estimatedDays = Math.ceil(estimatedDays / 2);
    } else if (deliveryType === 'SAME_DAY' && originState === destinationState) {
      estimatedDays = 0;
    }

    return { cost, estimatedDays };
  }

  // ============================================
  // MOCK METHODS FOR DEVELOPMENT
  // ============================================

  private mockCreateShipment(request: GIGShipmentRequest): GIGShipmentResponse {
    const waybillNumber = `GIG${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const estimatedDays = 3;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedDays);

    return {
      success: true,
      waybillNumber,
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
      shippingCost: 3500,
      message: 'Mock shipment created (dev mode)',
    };
  }

  private mockTrackShipment(waybillNumber: string): GIGTrackingResponse {
    return {
      success: true,
      waybillNumber,
      status: 'IN_TRANSIT',
      location: 'Lagos Distribution Center',
      statusHistory: [
        {
          status: 'PICKED_UP',
          location: 'Lagos Warehouse',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          remarks: 'Package picked up from sender',
        },
        {
          status: 'IN_TRANSIT',
          location: 'Lagos Distribution Center',
          timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          remarks: 'Package in transit to destination',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    };
  }
}
