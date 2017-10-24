const fs   = require('mz/fs'),
      path = require('path'),
      os   = require('os');

const _writeToFile = async (destinationDir, listFileIndex, listFileContent) => {
  const zipCmd = `7z a ${destinationDir}/file_${listFileIndex}.7z @${path.join(destinationDir, 'list_' + listFileIndex + '.txt')}${os.EOL}`;
  await fs.appendFile(path.join(destinationDir, 'zip.sh'), zipCmd);
  await fs.writeFile(path.join(destinationDir, `list_${listFileIndex}.txt`), listFileContent);
};

const zipFiles = async (sourceDir, destinationDir, maxSize = 2 * 1024 * 1024 * 1024, extensions = []) => {
  return new Promise(async (resolve, reject) => {
      if (await fs.exists(sourceDir) && await fs.exists(destinationDir)) {
        let files           = await fs.readdir(sourceDir);
        files               = files.filter(item => {
          const con = extensions.length === 0,
                r2  = extensions.includes(path.extname(item));

          return con || r2;
        });
        // console.log(files);
        let totalFileSize   = 0,
            listFileIndex   = 0,
            listFileContent = '';

        await fs.writeFile(path.join(destinationDir, 'zip.sh'), `#!/usr/bin/env bash${os.EOL}`);
        for (const file of files) {
          const states = await fs.stat(path.join(sourceDir, file));
          totalFileSize += states.size;
          listFileContent += path.join(sourceDir, file) + os.EOL;
          if (totalFileSize > maxSize) {
            await _writeToFile(destinationDir, listFileIndex, listFileContent);

            ++listFileIndex;
            // re-init
            listFileContent = '';
            totalFileSize   = 0;
          }
        }
        // process tail files
        if (totalFileSize !== 0) {
          await _writeToFile(destinationDir, listFileIndex, listFileContent);
        }
        console.log(`success, please follow zip-data-separate's readme step 2.`);
      } else {
        reject(sourceDir + ' or ' + destinationDir + ' not exist');
      }
    }
  );
};

module.exports = {
  zipFiles
};