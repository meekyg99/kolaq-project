import { OnModuleInit } from '@nestjs/common';
import { OrderService } from './modules/order/order.service';
import { NotificationService } from './modules/notification/notification.service';
export declare class AppModule implements OnModuleInit {
    private readonly orderService;
    private readonly notificationService;
    constructor(orderService: OrderService, notificationService: NotificationService);
    onModuleInit(): void;
}
