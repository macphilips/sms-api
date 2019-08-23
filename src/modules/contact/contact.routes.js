import models from '../../database/models';
import ContactController from './contact.controller';
import { errorCatcher } from '../errors';
import ContactRepository from './contact.repository';

const express = require('express');

const router = express.Router();
const service = new ContactRepository(models.Contact);
const controller = new ContactController(service);

/**
 * @swagger
 * parameters:
 *   id:
 *    in: path
 *    name: id
 *    required: true
 *    type: integer
 *    description: Contact ID
 *    example: 1
 */

/**
 * @swagger
 * definitions:
 *   Contact:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *         example: 1
 *       name:
 *         type: string
 *         example: John Doe
 *       phoneNumber:
 *         type: string
 *         example: 080345678909
 *   Contacts:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Contact'
 *   ContactError:
 *     type: object
 *     properties:
 *       code:
 *         type: string
 *         example: DEP_01
 *       message:
 *         type: string
 *         example: The ID is not a number.
 *       field:
 *         type: string
 *         example: product_id
 *
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     description: Create contact
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: body
 *         name: create_contact
 *         schema:
 *          properties:
 *            name:
 *              type: string
 *              example: John Doe
 *            phoneNumber:
 *              type: string
 *              example: 080345678909
 *     responses:
 *       201:
 *         description: Returns the created contact
 *         schema:
 *            $ref: '#/definitions/Contact'
 */
router.post('', errorCatcher(controller.createContact));

/**
 * @swagger
 *
 * /contacts:
 *   get:
 *     description: Get all contacts
 *     produces:
 *       - application/json
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Returns an array of contacts
 *         schema:
 *            $ref: '#/definitions/Contacts'
 */
router.get('', errorCatcher(controller.getContacts));

/**
 * @swagger
 *
 * /contacts/{id}:
 *   put:
 *     description: Update contact by id
 *     produces:
 *       - application/json
 *     tags:
 *       - Contacts
 *     parameters:
 *       - $ref: '#/parameters/id'
 *       - in: body
 *         name: update_contact
 *         schema:
 *          properties:
 *            name:
 *              type: string
 *              example: John Doe
 *            phoneNumber:
 *              type: string
 *              example: 080345678909
 *     responses:
 *       200:
 *         description: Returns the updated contact
 *         schema:
 *            $ref: '#/definitions/Contact'
 */
router.put('/:id', errorCatcher(controller.updateContact));

/**
 * @swagger
 *
 * /contacts/{id}:
 *   get:
 *     description: Get contact by id
 *     produces:
 *       - application/json
 *     tags:
 *       - Contacts
 *     parameters:
 *       - $ref: '#/parameters/id'
 *     responses:
 *       200:
 *         description: Returns the updated contact
 *         schema:
 *            $ref: '#/definitions/Contact'
 */
router.get('/:id', errorCatcher(controller.getContactById));

/**
 * @swagger
 *
 * /contacts/{id}:
 *   delete:
 *     description: Delete contact by id
 *     produces:
 *       - application/json
 *     tags:
 *       - Contacts
 *     parameters:
 *       - $ref: '#/parameters/id'
 *     responses:
 *       200:
 *         description: Returns the updated contact
 *         schema:
 *            properties:
 *              message:
 *                type: string
 */
router.delete('/:id', errorCatcher(controller.deleteContact));

export default (app, baseUrl) => {
  app.use(`${baseUrl}/contacts`, router);
};
