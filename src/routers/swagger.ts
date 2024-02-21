import { Application, NextFunction, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.APP_PORT || 3060;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Trip Project APIs', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'API documentation for Trip Project APIs' // Description of your API
    },
    servers: [
      {
        url: `http://localhost:${PORT}` // Base URL of your API
      }
    ]
  },
  apis: ['./**/*.ts'] // Path to your TypeScript route files
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
