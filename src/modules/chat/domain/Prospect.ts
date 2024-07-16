export class Prospect {
  id: string;
  description: string;
  sku: string;
  extraPaid: number;
  subsidy: number;
  substitutionId: string;

  constructor(params: Partial<Prospect>) {
    this.id = params.id;
    this.description = params.description;
    this.sku = params.sku;
    this.extraPaid = params.extraPaid;
    this.subsidy = params.subsidy;
    this.substitutionId = params.substitutionId;
  }
}
