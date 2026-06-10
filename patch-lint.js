const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
  const fullPath = path.join(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;
  for (const rep of replacements) {
    if (rep.regex) {
      content = content.replace(rep.regex, rep.replaceStr);
    } else {
      content = content.split(rep.searchStr).join(rep.replaceStr);
    }
  }
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

// 1. app.module.ts
replaceFile('apps/api/src/app.module.ts', [
  { searchStr: 'catch (e) {', replaceStr: 'catch (_e) {' }
]);

// 2. 1746400000000-AddUsernameToUsers.ts
replaceFile('apps/api/src/database/migrations/1746400000000-AddUsernameToUsers.ts', [
  { searchStr: 'TableColumn, ', replaceStr: '' },
  { searchStr: 'public async down(queryRunner: QueryRunner): Promise<void>', replaceStr: 'public async down(_queryRunner: QueryRunner): Promise<void>' }
]);

// 3. 1777949000000-AddStripePaymentGateway.ts
replaceFile('apps/api/src/database/migrations/1777949000000-AddStripePaymentGateway.ts', [
  { searchStr: 'public async down(queryRunner: QueryRunner): Promise<void>', replaceStr: 'public async down(_queryRunner: QueryRunner): Promise<void>' }
]);

// 4. revenue.service.ts
replaceFile('apps/api/src/modules/admin/services/revenue.service.ts', [
  { searchStr: 'async reconcileRevenue(', replaceStr: '// eslint-disable-next-line @typescript-eslint/require-await\n  async reconcileRevenue(' }
]);

// 5. settings.service.ts
replaceFile('apps/api/src/modules/admin/services/settings.service.ts', [
  { searchStr: 'NotFoundException, ', replaceStr: '' },
  { searchStr: ' NotFoundException,', replaceStr: '' },
  { searchStr: ' NotFoundException ', replaceStr: ' ' }
]);

// 6. ads-cron.processor.ts
replaceFile('apps/api/src/modules/ads/services/ads-cron.processor.ts', [
  { searchStr: 'async handleStaleAds(job: Job) {', replaceStr: 'async handleStaleAds(_job: Job) {' },
  { searchStr: 'async handleAdInvoices(job: Job) {', replaceStr: 'async handleAdInvoices(_job: Job) {' },
  { searchStr: 'async process(job: Job)', replaceStr: 'async process(_job: Job)' }
]);

// 7. ads.service.ts
replaceFile('apps/api/src/modules/ads/services/ads.service.ts', [
  { searchStr: 'async getTodaySpend(campaignId: string)', replaceStr: '// eslint-disable-next-line @typescript-eslint/require-await\n  async getTodaySpend(_campaignId: string)' },
  { searchStr: 'async getNextEligibleCampaign()', replaceStr: '// eslint-disable-next-line @typescript-eslint/require-await\n  async getNextEligibleCampaign()' },
  { searchStr: 'recordImpression(adId: string, ipAddress?: string)', replaceStr: 'recordImpression(adId: string, _ipAddress?: string)' },
  { searchStr: 'recordClick(adId: string, ipAddress?: string)', replaceStr: 'recordClick(adId: string, _ipAddress?: string)' }
]);

// 8. mail.service.ts
replaceFile('apps/api/src/modules/auth/mail.service.ts', [
  { regex: /campaignId: string/g, replaceStr: '_campaignId: string' },
  { regex: /campaignId/g, replaceStr: '_campaignId' } // wait, campaignId is just an unused param.
]);
// Actually, for mail.service.ts, the param is `campaignId`, we can just replace `campaignId: string` with `_campaignId: string`. Let's refine.

// Let's rewrite the mail.service replacements carefully.
let mailContent = fs.readFileSync(path.join(__dirname, 'apps/api/src/modules/auth/mail.service.ts'), 'utf8');
mailContent = mailContent.replace(/campaignId: string/g, '_campaignId: string');
fs.writeFileSync(path.join(__dirname, 'apps/api/src/modules/auth/mail.service.ts'), mailContent, 'utf8');
console.log('Fixed auth/mail.service.ts');

// 9. job.controller.ts
replaceFile('apps/api/src/modules/job/job.controller.ts', [
  { searchStr: 'CreateJobDto, ', replaceStr: '' },
  { searchStr: ' CreateJobDto,', replaceStr: '' }
]);

