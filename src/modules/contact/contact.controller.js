class ContactController {
  /**
   * @constructor
   *
   * @param {ContactRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  createContact = async (req, res) => {
    const { name, phoneNumber } = req.body;
    const contact = await this.repository.createContact({
      name,
      phoneNumber
    });

    res.status(201)
      .json(contact);
  };

  updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;

    const contact = await this.repository.updateContact({
      id,
      name,
      phoneNumber
    });

    res.status(200)
      .json(contact);
  };

  getContacts = async (req, res) => {
    res.status(200)
      .json(await this.repository.getContacts());
  };

  getContactById = async (req, res) => {
    res.status(200)
      .json(await this.repository.getContactById(req.params.id));
  };

  deleteContact = async (req, res) => {
    await this.repository.deleteContact(req.params.id);
    res.status(200)
      .json({
        status: 'successful'
      });
  };
}

export default ContactController;
