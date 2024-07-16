import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Chat1718283482178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'shippingGroupId',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'choice',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'agreeExtraPaid',
            type: 'bit',
            default: 0,
          },
          {
            name: 'customerPhone',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'customerId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime2',
            default: 'GETUTCDATE()',
          },
          {
            name: 'updatedAt',
            type: 'datetime2',
            default: 'GETUTCDATE()',
            onUpdate: 'GETUTCDATE()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat');
  }
}
