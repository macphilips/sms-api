import models from '../../database/models';
import SMSController from './sms.controller';
import { errorCatcher } from '../errors';
import SMSRepository from './sms.repository';

const express = require('express');

const router = express.Router();
const service = new SMSRepository(models.SMS, models.Contact);
const controller = new SMSController(service);

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
 *   Message:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *         example: 1
 *       message:
 *         type: string
 *         example: This is a message
 *       sender:
 *         type: string
 *         example: 080345678900
 *       receiver:
 *         type: string
 *         example: 080345678909
 *       status:
 *         type: string
 *         enum:
 *         - Sent
 *         - Failed
 *         example: Sent
 *   Messages:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Message'
 *
 */

/**
 * @swagger
 *
 * /sms/send:
 *   post:
 *     description: Send sms to another contact
 *     produces:
 *       - application/json
 *     tags:
 *       - SMS
 *     parameters:
 *       - in: body
 *         name: send_message
 *         schema:
 *          properties:
 *            message:
 *              type: string
 *              example: The is a message
 *            sender:
 *              type: string
 *              example: 080345678908
 *            receiver:
 *              type: string
 *              example: 080345678909
 *     responses:
 *       200:
 *         description: Returns the created contact
 *         schema:
 *          properties:
 *            status:
 *              type: string
 *              enum:
 *              - Sent
 *              - Failed
 *              example: Sent
 *            message:
 *              type: string
 *              example: 080345678909
 */
router.post('/send', errorCatcher(controller.sendMessage));

/**
 * @swagger
 *
 * /sms/{id}/received:
 *   get:
 *     description: Get all sent messages for a contact
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/id'
 *     tags:
 *       - SMS
 *     responses:
 *       200:
 *         description: Returns an array of contacts
 *         schema:
 *            $ref: '#/definitions/Messages'
 */
router.get('/:id/received', errorCatcher(controller.getReceivedMessages));

/**
 * @swagger
 *
 * /sms/{id}/sent:
 *   get:
 *     description: Get all received messages for a contact
 *     produces:
 *       - application/json
 *     tags:
 *       - SMS
 *     parameters:
 *       - $ref: '#/parameters/id'
 *     responses:
 *       200:
 *         description: Returns the updated contact
 *         schema:
 *            $ref: '#/definitions/Messages'
 */
router.get('/:id/sent', errorCatcher(controller.getSentMessages));

export default (app, baseUrl) => {
  app.use(`${baseUrl}/sms`, router);
};
