import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const apiDocsOptions = {
  customSiteTitle: 'SMS Management API Documentation',
};

const host = process.env.BASE_URL;

export default (app, basePath) => {
  const config = swaggerJSDoc({
    swaggerDefinition: {
      info: {
        title: 'SMS Management API Docs',
        version: '1.0.0',
        description: 'Documentation for the SMS Management API (v1)'
      },
      schemes: ['http', 'https'],
      host: `${host}`,
      basePath: `${basePath}`,
      produces: ['application/json'],
      consumes: ['application/json'],
      securityDefinitions: {
      },
      security: []
    },
    apis: ['./**/*.routes.js']
  });

  app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(config, apiDocsOptions));
};
