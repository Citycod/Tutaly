import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToUsers1746400000000 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // Column already exists in DB
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'username');
  }
}
