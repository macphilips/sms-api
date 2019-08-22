import registerApiDoc from './api-docs';

const basePath = 'api/v1';
const routes = (app) => {
  registerApiDoc(app, basePath);
  // must be the last thing to register
  return app;
};


export default routes;
