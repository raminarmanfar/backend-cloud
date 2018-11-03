import * as fs from 'fs';
import * as Promise from 'promise';
import { Response } from 'express';
import { ServiceResponse } from './models/ServiceResponse';
/**
 * Denodeify fs stat method 
 */
export let fileStat = Promise.denodeify(fs.stat);

/**
 * Denodeify fs unlink
 */
export let fileUnlink = Promise.denodeify(fs.unlink);

export let deleteFile = (res: Response, path: any): void => {
    // Delete file
    fileStat(path)
        .then(fileExist => {
            // Delete the file and update the microservice.
            fileUnlink(path).then(data => {
                // Resolve promise on deletion success
                return;
            })
                .catch((error) => res.status(500).json(new ServiceResponse(false, 500, 'Error on deleting the file.', error)));
        }).catch((error) => {
            // If the file is not found carry on. If there is a different error throw a 500 error and abort.
            if (error.code !== 'ENOENT') {
                res.status(500).json(new ServiceResponse(false, 500, 'Error deleting file.', error));
            }
            return;
        });
}
