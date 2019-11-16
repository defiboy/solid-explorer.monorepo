import { Server } from 'http';
import url from 'url';

import { app, logger } from '../src';

const port = app.get('port');

export const startServer = async (): Promise<Server> => {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
            resolve(server)
        })
    })
}

export const getUrl = (pathname?: string) => url.format({
    hostname: app.get('host') || 'localhost',
    protocol: 'http',
    port,
    pathname
});