import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexChat1718285971154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'chat',
      new TableIndex({
        name: 'shippingGroupId',
        columnNames: ['shippingGroupId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('chat', 'shippingGroupId');
  }
}
