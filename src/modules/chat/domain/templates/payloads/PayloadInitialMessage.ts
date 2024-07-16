import { PayloadMessage } from './PayloadMessage';
import { FirstName } from '../../../../shared/domain/valueObject/FirstName';
import { FieldButton } from '../../valueObject/FieldButton';

interface PayloadInitialMessageFromRequest {
  call_option_button: string;
  choose_for_me_option_button: string;
  customer_first_name: string;
  refund_option_button: string;
}

interface IParams {
  customerFirstName: string;
  callOptionButton: string;
  chooseForMeOptionButton: string;
  refundOptionButton: string;
}

export class PayloadInitialMessage
  implements PayloadMessage<PayloadInitialMessageFromRequest>
{
  customerFirstName: FirstName;
  callOptionButton: FieldButton;
  chooseForMeOptionButton: FieldButton;
  refundOptionButton: FieldButton;

  constructor(param: IParams) {
    this.customerFirstName = new FirstName(param.customerFirstName);
    this.callOptionButton = new FieldButton(param.callOptionButton);
    this.chooseForMeOptionButton = new FieldButton(
      param.chooseForMeOptionButton,
    );
    this.refundOptionButton = new FieldButton(param.refundOptionButton);
  }

  fromRequest(): PayloadInitialMessageFromRequest {
    return {
      call_option_button: this.callOptionButton.value,
      choose_for_me_option_button: this.chooseForMeOptionButton.value,
      customer_first_name: this.customerFirstName.value,
      refund_option_button: this.refundOptionButton.value,
    };
  }
}
