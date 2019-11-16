import { buildFakeFileItem } from '@solid-explorer/types';

import { app } from '../../src';

describe('FileItems service', () => {

    it('registered the service', () => {
        const service = app.service('file-items');

        expect(service).toBeTruthy();
    });

    it('inserts a file item entry correctly', async () => {
        const newFileItem = [buildFakeFileItem()]

        const service = app.service('file-items');

        const fileItem = await service.create(newFileItem)

        expect(fileItem).toBeDefined()
    })
})