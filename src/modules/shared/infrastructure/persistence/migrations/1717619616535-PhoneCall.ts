import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PhoneCall1717619616535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'phoneCall',
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
            name: 'answer',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'customerPhone',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'pickerPhone',
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
            name: 'notificationId',
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
            name: 'duration',
            type: 'varchar',
            length: '100',
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
    await queryRunner.dropTable('phoneCall');
  }
}
