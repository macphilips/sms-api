import HttpError from '../errors/HttpError';

class ContactRepository {
  constructor(contactModel) {
    this.contactModel = contactModel;
  }

  async createContact({ name, phoneNumber }) {
    let contact = await this.contactModel.findOne({ where: { phoneNumber } });
    if (contact) throw new HttpError('USR_01', 'phoneNumber', null, 400);
    contact = await this.contactModel.create({
      name,
      phoneNumber
    });

    return contact.toJSON();
  }

  async updateContact({ id, name, phoneNumber }) {
    const contact = await this.contactModel.findOne({ where: { phoneNumber } });
    const me = await this.contactModel.findByPk(id);
    if (!me) throw new HttpError('USR_02', null, null, 400);
    if (contact && contact.phoneNumber !== me.phoneNumber) throw new HttpError('USR_01', 'phoneNumber', null, 400);
    await me.update({
      name,
      phoneNumber
    });

    return me.toJSON();
  }

  async getContacts() {
    const contacts = await this.contactModel.findAll();
    return contacts.map(contact => contact.toJSON());
  }

  async getContactById(id) {
    const contact = await this.contactModel.findByPk(id);
    if (!contact) throw new HttpError('USR_02', 'id', null, 404);
    return contact.toJSON();
  }

  async deleteContact(id) {
    await this.contactModel.destroy({ where: { id }, cascade: true });
  }
}

export default ContactRepository;
