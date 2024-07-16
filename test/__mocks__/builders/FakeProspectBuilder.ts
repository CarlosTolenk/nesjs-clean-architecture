import { v4 as uuidv4 } from 'uuid';

// Infrastructure
import { FakeBuilder } from './types';
import { ProspectEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Prospect.entity';

export class FakeProspectBuilder implements FakeBuilder<ProspectEntity> {
  private substitutionId: string = '';
  private extraPaid: number = 0;
  private subsidy: number = 0;

  withSubstitutionId(substitutionId: string) {
    this.substitutionId = substitutionId;
    return this;
  }
  withExtraPaid(extraPaid: number) {
    this.extraPaid = extraPaid;
    return this;
  }
  withSubsidy(subsidy: number) {
    this.subsidy = subsidy;
    return this;
  }

  build(): ProspectEntity {
    const prospectEntity = new ProspectEntity();
    prospectEntity.id = uuidv4();
    prospectEntity.substitutionId = this.substitutionId;
    prospectEntity.description = 'description';
    prospectEntity.sku = 'sku';
    prospectEntity.extraPaid = this.extraPaid;
    prospectEntity.subsidy = this.subsidy;
    return prospectEntity;
  }
}
