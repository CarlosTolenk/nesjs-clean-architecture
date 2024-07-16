import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexProspect1718285980452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'prospect',
      new TableIndex({
        name: 'substitutionId',
        columnNames: ['substitutionId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('prospect', 'substitutionId');
  }
}
