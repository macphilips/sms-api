import request from 'supertest';
import faker from 'faker';
import app from '../../app';
import models from '../../database/models';

const { Contact, SMS } = models;

describe('SMS Endpoint', () => {
  let contact1, contact2;
  beforeAll(async () => {
    contact1 = await Contact.create({
      name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
      phoneNumber: faker.phone.phoneNumber(),
    });
    contact2 = await Contact.create({
      name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
      phoneNumber: faker.phone.phoneNumber(),
    });
  });
  afterEach(async () => {
    SMS.destroy({
      truncate: true
    });
  });
  describe('send message', () => {
    test('should send message from one contact to another', async () => {
      const message = {
        message: faker.lorem.sentences(),
        sender: contact1.phoneNumber,
        receiver: contact2.phoneNumber,
      };
      const res = await request(app)
        .post('/api/v1/sms/send')
        .send(message)
        .set({
          Accept: 'application/json',
        });

      expect(res.status)
        .toEqual(200);
      expect(res.body.status)
        .toEqual('Sent');
      expect(res.body.message)
        .toEqual(message.message);
    });
    test('should not send message if contact does not exist', async () => {
      let message = {
        message: faker.lorem.sentences(),
        sender: contact1.phoneNumber,
        receiver: faker.phone.phoneNumber(),
      };
      let res = await request(app)
        .post('/api/v1/sms/send')
        .send(message)
        .set({
          Accept: 'application/json',
        });

      expect(res.status)
        .toEqual(200);
      expect(res.body.status)
        .toEqual('Failed');
      expect(res.body.reason.trim())
        .toEqual(`Unknown contact: ${message.receiver}`);
      message = {
        message: faker.lorem.sentences(),
        receiver: contact2.phoneNumber,
        sender: faker.phone.phoneNumber(),
      };
      res = await request(app)
        .post('/api/v1/sms/send')
        .send(message)
        .set({
          Accept: 'application/json',
        });

      expect(res.status)
        .toEqual(200);
      expect(res.body.status)
        .toEqual('Failed');
      expect(res.body.reason.trim())
        .toEqual(`Unknown contact: ${message.sender}`);
    });
  });

  describe('get sent messages for a contact', () => {
    test('', async () => {
      const message1 = {
        message: faker.lorem.sentences(),
        receiverId: contact2.id,
        senderId: contact1.id,
      };
      const message2 = {
        message: faker.lorem.sentences(),
        receiverId: contact1.id,
        senderId: contact2.id,
      };
      await SMS.create(message1);
      await SMS.create(message2);
      const res = await request(app)
        .get(`/api/v1/sms/${contact1.id}/sent`)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(200);

      expect(res.body.length)
        .toEqual(1);
      expect(res.body[0].message)
        .toEqual(message1.message);
    });
  });
  describe('get received messages for a contact', () => {
    test('', async () => {
      const message1 = {
        message: faker.lorem.sentences(),
        receiverId: contact2.id,
        senderId: contact1.id,
      };
      const message2 = {
        message: faker.lorem.sentences(),
        receiverId: contact1.id,
        senderId: contact2.id,
      };
      await SMS.create(message1);
      await SMS.create(message2);
      const res = await request(app)
        .get(`/api/v1/sms/${contact1.id}/received`)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(200);

      expect(res.body.length)
        .toEqual(1);
      expect(res.body[0].message)
        .toEqual(message2.message);
    });
  });
});
