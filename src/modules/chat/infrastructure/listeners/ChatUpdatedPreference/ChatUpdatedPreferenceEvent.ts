export class ChatUpdatedPreferenceEvent {
  shippingGroupId: string;
  choice: string;

  constructor(params: Partial<ChatUpdatedPreferenceEvent>) {
    this.shippingGroupId = params.shippingGroupId;
    this.choice = params.choice;
  }
}
