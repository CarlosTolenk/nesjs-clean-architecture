import nock from 'nock';

const host = 'https://twilio.com';

export class MakeCallMockServer {
  static fail() {
    nock(host)
      .post('/v1/calls')
      .reply(500, {
        data: {
          notification: {
            id: 'notificationId',
          },
        },
      });
  }

  static notFound() {
    nock(host)
      .post('/v1/calls')
      .reply(404, {
        data: {
          notification: {
            id: 'notificationId',
          },
        },
      });
  }

  static badRequest() {
    nock(host)
      .post('/v1/calls')
      .reply(404, {
        data: {
          notification: {
            id: 'notificationId',
          },
        },
      });
  }

  static success() {
    nock(host)
      .post('/v1/calls')
      .reply(200, {
        data: {
          notification: {
            id: 'notificationId',
          },
        },
      });
  }
}
