import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/user/user.entity';
import { Note } from '../../modules/note/note.entity';
import { UserNote } from '../../modules/userNote/userNote.entity';


export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
            case DEVELOPMENT:
                config = databaseConfig.development;
                break;
            case TEST:
                config = databaseConfig.test;
                break;
            case PRODUCTION:
                config = databaseConfig.production;
                break;
            default:
                config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([User, Note, UserNote]);


        // if (process.env.SEQUELIZE_NO_SYNC != 'true') {
        //     await User.sync({ alter: true });
        //     await Note.sync({ alter: true });
        //     await UserNote.sync({ alter: true });
        // }
        return sequelize;
    },
}];
