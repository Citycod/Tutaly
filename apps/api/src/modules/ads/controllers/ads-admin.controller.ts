import { Controller, Get, Patch, Param, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';
import { AdsService } from '../services/ads.service';

@Controller('admin/ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdsAdminController {
  constructor(private readonly adsService: AdsService) {}

  @Get('queue')
  async getQueue() {
    return this.adsService.getPendingQueue();
  }

  @Patch(':id/approve')
  async approveCampaign(@Param('id') id: string) {
    return this.adsService.approveCampaign(id);
  }

  @Patch(':id/reject')
  async rejectCampaign(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adsService.rejectCampaign(id, reason);
  }

  @Get('all')
  async getAllCampaigns() {
    return this.adsService.getAllCampaigns();
  }
}
