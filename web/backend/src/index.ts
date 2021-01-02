import chalk from 'chalk';
import express from 'express';
import temp from 'temp';
import config from './config';
import database from './database';
import routes from './routes';

temp.track()

async function run() {


    await database()

    const app = express()
    routes(app)

    //await Pack.create({ link: 'https://www.dropbox.com/s/35jr27e1aqd9nlo/spicy-vanilla-smoothie.zip?dl=1', id: 1 })
    //    .createVersion()
    //    .catch(e => console.log(e))

    //await Mod.delete({})
    //await Version.delete({})
    //await Pack.delete({})
    //const pack = await Pack.create({ link: 'Spicy Vanilla Smoothie' }).save()

    //await pack.createVersion('1.0.0');
    //await pack.createVersion('2.0.0');

    app.listen(config.api.port, () => {
        console.log(chalk`Listening on {underline http://localhost:${config.api.port}}`)
        console.log()
    })

}

run().catch(e => console.error(e));
