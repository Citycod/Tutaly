import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class UpdatePostsTableForConnect1746400100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if imageUrls column exists, if not add it
    const table = await queryRunner.getTable('posts');
    if (table && !table.findColumnByName('imageUrls')) {
      await queryRunner.addColumn(
        'posts',
        new TableColumn({
          name: 'imageUrls',
          type: 'varchar',
          isArray: true,
          isNullable: true,
        }),
      );
    }

    // Check if sharesCount exists, if not add it
    if (table && !table.findColumnByName('sharesCount')) {
      await queryRunner.addColumn(
        'posts',
        new TableColumn({
          name: 'sharesCount',
          type: 'integer',
          default: 0,
        }),
      );
    }

    // Add indexes for feed queries
    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        columnNames: ['authorId', 'createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        columnNames: ['createdAt', 'id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const postsTable = await queryRunner.getTable('posts');
    if (postsTable) {
      const indexAuthorCreated = postsTable.indices.find(
        i => i.columnNames.includes('authorId') && i.columnNames.includes('createdAt'),
      );
      if (indexAuthorCreated) {
        await queryRunner.dropIndex('posts', indexAuthorCreated);
      }
      const indexCreatedId = postsTable.indices.find(
        i => i.columnNames.includes('createdAt') && i.columnNames.includes('id'),
      );
      if (indexCreatedId) {
        await queryRunner.dropIndex('posts', indexCreatedId);
      }
    }

    const table = await queryRunner.getTable('posts');
    if (table && table.findColumnByName('sharesCount')) {
      await queryRunner.dropColumn('posts', 'sharesCount');
    }
    if (table && table.findColumnByName('imageUrls')) {
      await queryRunner.dropColumn('posts', 'imageUrls');
    }
  }
}
