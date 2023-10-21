const fs = require('fs');
const File = require('../models/Files');
const config = require('config');

class FileServices {
    createDir(req, file){
        // const FilePath = `${config.get('filePath')}\\${file.user}\\${file.path}`;
        const FilePath = this.getPath(req, file);
        return new Promise((resolve, reject) => {
            try {
                if(!fs.existsSync(FilePath)){
                    fs.mkdirSync(FilePath);
                    return resolve({message: 'File was create'});
                }else {
                    return reject({message: 'File already exist'});
                }
            } catch (error) {
                return reject({message: 'File error'});
            }
        })
    }

    deleteFile(req, file){
        const path = this.getPath(req, file);
        
        if(file.type === 'dir'){
            fs.rmdirSync(path);
        }else {
            fs.unlinkSync(path);
        }
        
    }

    getPath(req, file){
        return req.filePath + '\\' + file.user + '\\' + file.path;
    }
}

module.exports = new FileServices();