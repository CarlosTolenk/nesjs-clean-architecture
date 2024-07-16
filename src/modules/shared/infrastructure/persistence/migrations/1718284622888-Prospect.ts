import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Prospect1718284622888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospect',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'extraPaid',
            type: 'int',
          },
          {
            name: 'subsidy',
            type: 'int',
          },
          {
            name: 'substitutionId',
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
        foreignKeys: [
          {
            columnNames: ['substitutionId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'substitution',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prospect');
  }
}
