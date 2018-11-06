import * as fs from 'fs';
import * as promise from 'promise';
import { ServiceResponse } from './models/ServiceResponse';
/**
 * Denodeify fs stat method 
 */
export let fileStat = promise.denodeify(fs.stat);

/**
 * Denodeify fs unlink
 */
export let fileUnlink = promise.denodeify(fs.unlink);

export function deleteFile(path: any): Promise<ServiceResponse> {
    return new Promise((resolve: any, reject: any) => {
        fileStat(path).then(fileExist => {
            // Delete the file and update the microservice.
            fileUnlink(path).then(data => {
                resolve(true, 200, 'File deleted successfully.', data);
            }).catch((error) => reject(new ServiceResponse(false, 500, 'Error on deleting the file.', error)));
        }).catch((error) => {
            // If the file is not found carry on. If there is a different error throw a 500 error and abort.
            reject(new ServiceResponse(false, 500, 'Error deleting file.', error));
        });
    });
}

export function deleteFiles(files: Array<string>): Promise<ServiceResponse> {
    return new Promise((resolve: any, reject: any) => {
        for(let file of files) {
            if (file !== 'defaultUser.png') {
            deleteFile(file)
                //.then((result: ServiceResponse) => resolve(result))
                .catch((error: ServiceResponse) => reject(error));
            }
        }
        resolve(new ServiceResponse(true, 200, 'All users profile images deleted.'));
    });
}
