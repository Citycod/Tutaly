import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFeaturedFieldsToShopProducts1746316300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('shop_products', [
      new TableColumn({
        name: 'featured_until',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'featured_search_vector',
        type: 'tsvector',
        isNullable: true,
      }),
    ]);

    // Create indexes for featured listings and search
    await queryRunner.query(
      'CREATE INDEX idx_shop_products_featured_until ON shop_products(featured_until DESC) WHERE featured_until IS NOT NULL;',
    );

    await queryRunner.query(
      'CREATE INDEX idx_shop_products_featured_search_vector ON shop_products USING gin(featured_search_vector);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX idx_shop_products_featured_search_vector;',
    );
    await queryRunner.query('DROP INDEX idx_shop_products_featured_until;');

    await queryRunner.dropColumns('shop_products', [
      'featured_until',
      'featured_search_vector',
    ]);
  }
}
