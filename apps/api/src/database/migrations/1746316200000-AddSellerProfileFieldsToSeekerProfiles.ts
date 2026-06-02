import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSellerProfileFieldsToSeekerProfiles1746316100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('seeker_profiles', [
      new TableColumn({
        name: 'contact_phone',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
      new TableColumn({
        name: 'contact_whatsapp',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
      new TableColumn({
        name: 'seller_plan',
        type: 'enum',
        enum: ['free', 'basic', 'premium'],
        default: "'free'",
      }),
    ]);

    // Create index for seller plan (for filtering featured listings)
    await queryRunner.query(
      'CREATE INDEX idx_seeker_profiles_seller_plan ON seeker_profiles(seller_plan);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX idx_seeker_profiles_seller_plan;');

    await queryRunner.dropColumns('seeker_profiles', [
      'contact_phone',
      'contact_whatsapp',
      'seller_plan',
    ]);
  }
}
