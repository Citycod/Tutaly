import { Controller, Get, Post, Query, Body, Req } from '@nestjs/common';
import { AdsService } from '../services/ads.service';

@Controller('ads')
export class AdsTrackingController {
  constructor(private readonly adsService: AdsService) {}

  @Get('active')
  async getActiveAd(@Query('placement') placement: string, @Req() req: any) {
    if (!placement) {
      return { error: 'Placement is required' };
    }

    // Serve ads to ALL users including seekers and guests
    const currentUser = req.user; // Might be undefined if guest, depending on global auth setup
    
    const ad = await this.adsService.getActiveAd(placement, currentUser);
    return ad ? { ad } : { ad: null };
  }

  @Post('impression')
  async logImpression(@Body() body: any) {
    // Log impression logic
    return { success: true };
  }

  @Post('click')
  async logClick(@Body() body: any) {
    // Log click logic
    return { success: true };
  }
}
