class SMSController {
  /**
   * @constructor
   *
   * @param {SMSRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  sendMessage = async (req, res) => {
    const { receiver, sender, message } = req.body;
    const msg = await this.repository.sendMessage(sender, receiver, message);

    res.status(200)
      .json(msg);
  };

  getSentMessages = async (req, res) => {
    const { id: contactId } = req.params;
    const messages = await this.repository.getSentMessages(contactId);

    res.status(200)
      .json(messages);
  };

  getReceivedMessages = async (req, res) => {
    const { id: contactId } = req.params;
    const messages = await this.repository.getReceivedMessages(contactId);

    res.status(200)
      .json(messages);
  };
}

export default SMSController;
