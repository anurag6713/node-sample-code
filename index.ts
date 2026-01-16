import app from './app';
import config from './config';
import db from './db';

db.connect(config.MONGO_URI, config.MONGO_DB_NAME)
    .then(() => {
        console.log('Successfully Connected To MongoDB');
        app(
            config.PORT,
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('./router').default, // If imported earlier collection access gets undefined
        );
    })
    .catch((error) => {
        console.log('MongoDB Error: ', error);
    });
