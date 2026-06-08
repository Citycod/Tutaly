import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdsAdminController {
  
  @Get('queue')
  async getQueue() {
    // Return pending_review campaigns
    return [];
  }

  @Patch(':id/approve')
  async approveCampaign(@Param('id') id: string) {
    // Approve campaign logic
    return { success: true };
  }

  @Patch(':id/reject')
  async rejectCampaign(@Param('id') id: string) {
    // Reject campaign logic
    return { success: true };
  }

  @Get('all')
  async getAllCampaigns() {
    return [];
  }
}
