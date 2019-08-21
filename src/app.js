import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import sassMiddleware from 'node-sass-middleware';
import logger from 'morgan';
import registerModules from './modules';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '../public')));

registerModules(app);

export default app;
