import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexTablePhoneCall1717784474602
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const index1 = queryRunner.createIndex(
      'phoneCall',
      new TableIndex({
        name: 'shippingGroupId',
        columnNames: ['shippingGroupId'],
      }),
    );
    const index2 = queryRunner.createIndex(
      'phoneCall',
      new TableIndex({
        name: 'notificationId',
        columnNames: ['notificationId'],
      }),
    );

    await Promise.all([index1, index2]);
    return;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dropIndex1 = queryRunner.dropIndex('phoneCall', 'shippingGroupId');
    const dropIndex2 = queryRunner.dropIndex('phoneCall', 'notificationId');
    await Promise.all([dropIndex1, dropIndex2]);
    return;
  }
}
