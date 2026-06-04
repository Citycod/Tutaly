import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { PhysicalOrderService } from '../services/physical-order.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MarkDeliveredDto, ConfirmReceiptDto } from '../dto/week7.dto';

interface AuthenticatedRequest {
  user: { sub: string; email: string; role: string };
}

@Controller('shop/orders')
export class PhysicalOrdersController {
  constructor(private readonly physicalOrderService: PhysicalOrderService) {}

  @Patch(':id/delivered')
  @UseGuards(JwtAuthGuard)
  async markDelivered(
    @Param('id') orderId: string,
    @NestRequest() req: AuthenticatedRequest,
    @Body() dto: MarkDeliveredDto,
  ) {
    return this.physicalOrderService.markDelivered(orderId, req.user.sub, dto);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmReceipt(
    @Param('id') orderId: string,
    @NestRequest() req: AuthenticatedRequest,
    @Body() dto?: ConfirmReceiptDto,
  ) {
    return this.physicalOrderService.confirmReceipt(orderId, req.user.sub, dto);
  }

  @Get('seller/physical')
  @UseGuards(JwtAuthGuard)
  async getSellerPhysicalOrders(
    @NestRequest() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.physicalOrderService.getSellerPhysicalOrders(
      req.user.sub,
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    );
  }

  @Get('buyer/physical')
  @UseGuards(JwtAuthGuard)
  async getBuyerPhysicalOrders(
    @NestRequest() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.physicalOrderService.getBuyerPhysicalOrders(
      req.user.sub,
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    );
  }
}
