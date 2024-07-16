interface SubstitutionPrimitives {
  id: string;
  messageId: string;
  agree: string;
  descriptionOriginal: string;
  skuOriginal: string;
  chatId: string;
}

export class Substitution {
  id: string;
  messageId: string;
  agree: string;
  descriptionOriginal: string;
  skuOriginal: string;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: Partial<Substitution>) {
    this.id = params.id;
    this.messageId = params.messageId;
    this.agree = params.agree;
    this.descriptionOriginal = params.descriptionOriginal;
    this.skuOriginal = params.skuOriginal;
    this.chatId = params.chatId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toPrimitives(): SubstitutionPrimitives {
    return {
      id: this.id,
      messageId: this.messageId,
      agree: this.agree,
      descriptionOriginal: this.descriptionOriginal,
      skuOriginal: this.skuOriginal,
      chatId: this.chatId,
    };
  }
}
