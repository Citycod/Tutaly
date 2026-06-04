import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAdminFieldsToUsers1746500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (table && !table.findColumnByName('isSuspended')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'isSuspended',
          type: 'boolean',
          default: false,
        }),
      );
    }

    if (table && !table.findColumnByName('isDeleted')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'isDeleted',
          type: 'boolean',
          default: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (table && table.findColumnByName('isSuspended')) {
      await queryRunner.dropColumn('users', 'isSuspended');
    }

    if (table && table.findColumnByName('isDeleted')) {
      await queryRunner.dropColumn('users', 'isDeleted');
    }
  }
}
