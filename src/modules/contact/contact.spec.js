import request from 'supertest';
import Sequelize from 'sequelize';
import faker from 'faker';
import app from '../../app';
import models from '../../database/models';
import { errors } from '../errors/HttpError';

const { Contact, SMS } = models;

describe('Customer Endpoint', () => {
  beforeEach(async () => {
    await Contact.create({
      name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
      phoneNumber: faker.phone.phoneNumber(),
    });
    await Contact.create({
      name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
      phoneNumber: faker.phone.phoneNumber(),
    });
  });
  afterEach(async () => {
    const model = await Contact.findAll();
    model.map(mo => mo.destroy());
  });
  describe('create contact', () => {
    test('should create new contact', async () => {
      const body = {
        name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
        phoneNumber: faker.phone.phoneNumber(),
      };
      const res = await request(app)
        .post('/api/v1/contacts')
        .send(body)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(201);

      const { phoneNumber, name } = res.body;

      expect(phoneNumber)
        .toEqual(body.phoneNumber);

      expect(name)
        .toEqual(body.name);
    });
    test('should not create new contact if phone number already exist', async () => {
      const contacts = await Contact.findAll();
      const body = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        phoneNumber: contacts[0].phoneNumber,
      };
      await Contact.create(body);
      const res = await request(app)
        .post('/api/v1/contacts')
        .send(body)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(400);


      expect(res.body)
        .toHaveProperty('field');

      expect(res.body.field)
        .toEqual('phoneNumber');

      expect(res.body)
        .toHaveProperty('code');
      expect(res.body.code)
        .toEqual('USR_01');

      expect(res.body)
        .toHaveProperty('message');
      expect(res.body.message)
        .toEqual(errors.USR_01(res.body.field));
    });
    // TODO fix validation
    describe.skip('validate input data', () => {
      test('should validate name', async () => {
        const body = {
          name: '                 ',
          phoneNumber: faker.phone.phoneNumber(),
        };
        const res = await request(app)
          .post('/api/v1/contacts')
          .send(body)
          .set({
            Accept: 'application/json',
          });
        expect(res.status)
          .toEqual(400);

        expect(res.body)
          .toEqual({
            status: 400,
            field: 'name',
            code: 'USR_01',
            message: errors.USR_01('name'),
          });
      });
      test('should validate phone number', async () => {
        const body = {
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          phoneNumber: faker.internet.password(),
        };
        const res = await request(app)
          .post('/api/v1/contacts')
          .send(body)
          .set({
            Accept: 'application/json',
          });
        expect(res.status)
          .toEqual(400);

        expect(res.body)
          .toEqual({
            status: 400,
            field: 'phoneNumber',
            code: 'USR_02',
            message: errors.USR_02,
          });
      });
    });
  });
  describe('update contact details', () => {
    let contact,
      body;
    beforeEach(async () => {
      const result = await Contact.create(contact);
      contact = {
        id: result.id,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      };
    });
    test('should update contact details', async () => {
      body = {
        ...contact,
        phoneNumber: faker.phone.phoneNumber(),
      };
      const res = await request(app)
        .put(`/api/v1/contacts/${contact.id}`)
        .send(body)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(200);
      expect(res.body.name)
        .toEqual(body.name);
      expect(res.body.phoneNumber)
        .toEqual(body.phoneNumber);
    });

    test('should not update contact that does not exist', async () => {
      body = {
        ...contact,
        phoneNumber: faker.phone.phoneNumber(),
      };
      const res = await request(app)
        .put('/api/v1/contacts/32322')
        .send(body)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(400);
      expect(res.body)
        .toEqual({
          code: 'USR_02',
          field: null,
          message: errors.USR_02,
        });
    });

    test('should not update contact details if phone number exist', async () => {
      const contact1 = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        phoneNumber: faker.phone.phoneNumber(),
      };
      const reqBody = {
        ...contact,
        phoneNumber: contact1.phoneNumber,
      };
      await Contact.create(contact1);
      const res = await request(app)
        .put(`/api/v1/contacts/${reqBody.id}`)
        .send(reqBody)
        .set({
          Accept: 'application/json',
        });
      expect(res.status)
        .toEqual(400);
      expect(res.body)
        .toEqual({
          code: 'USR_01',
          field: 'phoneNumber',
          message: errors.USR_01('phoneNumber'),
        });
    });
  });
  describe('get all contact', () => {
    test('', async () => {
      const res = await request(app)
        .get('/api/v1/contacts')
        .set({
          Accept: 'application/json',
        })
        .send();
      expect(res.status)
        .toEqual(200);
      const { body } = res;

      expect(body.length)
        .toEqual(2);
    });
  });
  describe('get contact by id', () => {
    test('should return contact by id', async () => {
      const contact = await Contact.findAll();

      const res = await request(app)
        .get(`/api/v1/contacts/${contact[0].id}`)
        .set({
          Accept: 'application/json',
        })
        .send();
      expect(res.status)
        .toEqual(200);
      const { body } = res;

      expect(body)
        .toHaveProperty('name');
      expect(body)
        .toHaveProperty('phoneNumber');
      expect(body)
        .toHaveProperty('id');
    });
  });
  describe('delete contact', () => {
    test('should delete contact and all the message send or received by the contact', async () => {
      const contact1 = await Contact.create({
        name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
        phoneNumber: faker.phone.phoneNumber()
      });
      const contact2 = await Contact.create({
        name: `${faker.name.firstName(0)} ${faker.name.lastName(0)}`,
        phoneNumber: faker.phone.phoneNumber()
      });

      await SMS.create({
        status: 'Sent',
        message: faker.lorem.sentences(),
        senderId: contact1.id,
        receiverId: contact2.id,
      });

      await SMS.create({
        status: 'Sent',
        message: faker.lorem.sentences(),
        receiverId: contact1.id,
        senderId: contact2.id,
      });

      const res = await request(app)
        .delete(`/api/v1/contacts/${contact1.id}`)
        .set({
          Accept: 'application/json',
        })
        .send();
      expect(res.status)
        .toEqual(200);
      const { body } = res;

      expect(body)
        .toHaveProperty('status');
      const { Op } = Sequelize;

      const sms = await SMS.findAll(
        {
          where: {
            [Op.or]: [
              { receiverId: contact1.id },
              { senderId: contact1.id },
            ]
          }
        }
      );

      expect(sms.length)
        .toEqual(0);
    });
  });
});
