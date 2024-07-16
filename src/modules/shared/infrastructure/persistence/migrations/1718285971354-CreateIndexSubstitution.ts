import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexSubstitution1718285971354
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'substitution',
      new TableIndex({
        name: 'chatId',
        columnNames: ['chatId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('substitution', 'chatId');
  }
}
