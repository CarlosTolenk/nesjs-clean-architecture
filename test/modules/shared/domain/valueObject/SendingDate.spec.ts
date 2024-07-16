import { SendingDate } from '../../../../../src/modules/shared/domain/valueObject/SendingDate';
import { DateTime } from 'luxon';

describe('SendingDate', () => {
  let realDateNow: any;

  beforeAll(() => {
    realDateNow = Date.now;
    Date.now = jest.fn(() => new Date('2023-07-03T00:00:00Z').getTime());
  });

  afterAll(() => {
    Date.now = realDateNow;
  });

  it('should create a valid SendingDate with the current date', () => {
    const currentDate = DateTime.local().toSQL();
    const sendingDate = new SendingDate();
    expect(sendingDate.value).toBe(currentDate);
  });
});
