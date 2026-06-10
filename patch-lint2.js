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

replaceFile('apps/api/src/app.module.ts', [
  { searchStr: 'catch (_e) {', replaceStr: 'catch {' }
]);

replaceFile('apps/api/src/database/migrations/1746400000000-AddUsernameToUsers.ts', [
  { searchStr: 'TableColumn', replaceStr: '' },
  { searchStr: 'public async down(queryRunner: QueryRunner)', replaceStr: 'public async down(_queryRunner: QueryRunner)' }
]);

replaceFile('apps/api/src/modules/ads/services/ads.service.ts', [
  { searchStr: 'async getNextEligibleCampaign()', replaceStr: '// eslint-disable-next-line @typescript-eslint/require-await\n  async getNextEligibleCampaign()' },
  { searchStr: 'async recordImpression(adId: string, ipAddress?: string)', replaceStr: 'async recordImpression(adId: string, _ipAddress?: string)' },
  { searchStr: 'async recordClick(adId: string, ipAddress?: string)', replaceStr: 'async recordClick(adId: string, _ipAddress?: string)' }
]);
