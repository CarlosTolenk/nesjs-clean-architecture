import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Substitution1718283483188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'substitution',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'agree',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'descriptionOriginal',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'skuOriginal',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'messageId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'chatId',
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
            columnNames: ['chatId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'chat',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('substitution');
  }
}
