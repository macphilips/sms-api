class SMSRepository {
  constructor(smsModel, contactModel) {
    this.smsModel = smsModel;
    this.contactModel = contactModel;
  }

  async sendMessage(from, to, message) {
    const sender = await this.contactModel.findOne({ where: { phoneNumber: from } });
    const receiver = await this.contactModel.findOne({ where: { phoneNumber: to } });

    let reason = '';
    let status = 'Sent';
    if (!sender) {
      reason += `Unknown contact: ${from}\n`;
      status = 'Failed';
    }
    if (!receiver) {
      reason += `Unknown contact: ${to}\n`;
      status = 'Failed';
    }
    const sms = await this.smsModel.create({
      message,
      status,
      senderId: (sender || {}).id,
      reason: reason || null,
      receiverId: (receiver || {}).id
    });
    return sms.toJSON();
  }

  async getSentMessages(contactID) {
    const where = {
      senderId: contactID
    };

    return this.getMessages(where);
  }

  async getReceivedMessages(contactID) {
    const where = {
      receiverId: contactID,
    };

    return this.getMessages(where);
  }

  async getMessages(where) {
    const include = [
      {
        model: this.contactModel,
        as: 'receiver',
      }, {
        model: this.contactModel,
        as: 'sender',
      }
    ];
    const messages = await this.smsModel.findAll({
      include,
      where
    });

    const callbackfn = (value) => {
      const {
        receiver, sender, message, reason, status
      } = value;
      return {
        message,
        reason,
        status,
        receiver: receiver.phoneNumber,
        sender: sender.phoneNumber,
      };
    };
    return messages.map(callbackfn);
  }
}

export default SMSRepository;
