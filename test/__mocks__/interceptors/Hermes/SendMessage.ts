import nock from 'nock';

const host = 'https://twilio.com';

export class SendMessageMockServer {
  static fail() {
    nock(host)
      .post('/v1/notifications')
      .reply(500, {
        data: {
          notificationId: 'notificationId',
        },
      });
  }

  static success() {
    nock(host)
      .post('/v1/notifications')
      .reply(200, {
        data: {
          notificationId: 'notificationId',
        },
      });
  }
}
