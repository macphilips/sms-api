import registerContactModule from './contact/contact.routes';
import registerSMSModule from './sms/sms.routes';
import registerApiDoc from './api-docs';
import { registerErrorHandler } from './errors';

const basePath = '/api/v1';
const routes = (app) => {
  registerSMSModule(app, basePath);
  registerContactModule(app, basePath);
  registerApiDoc(app, basePath);
  // must be the last thing to register
  registerErrorHandler(app);
  return app;
};


export default routes;
