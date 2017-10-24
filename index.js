const fs   = require('mz/fs'),
      path = require('path'),
      os   = require('os');

const _writeToFile = async (destinationDir, listFileIndex, listFileContent) => {
  const zipCmd = `7z a ${destinationDir}/file_${listFileIndex}.7z @${path.join(destinationDir, 'list_' + listFileIndex + '.txt')}${os.EOL}`;
  await fs.appendFile(path.join(destinationDir, 'zip.sh'), zipCmd);
  await fs.writeFile(path.join(destinationDir, `list_${listFileIndex}.txt`), listFileContent);
};

/**
 *
 * @param sourceDir
 * @param destinationDir
 * @param maxSize        max file size to separate to zip
 * @param extensions     file's extension
 * @returns {Promise}
 */
const zipFiles = async (sourceDir, destinationDir, maxSize = 2 * 1024 * 1024 * 1024, extensions = []) => {
  return new Promise(async (resolve, reject) => {
      if (await fs.exists(sourceDir) && await fs.exists(destinationDir)) {
        let files           = await fs.readdir(sourceDir);
        files               = files.filter(item => extensions.length === 0 || extensions.includes(path.extname(item)));
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
        console.log(`success, please follow below operations.
1.cd ${destinationDir}
2.execute zip.sh
3.wait script to execute to generate *.7z`);
      } else {
        reject(sourceDir + ' or ' + destinationDir + ' not exist');
      }
    }
  );
};

module.exports = {
  zipFiles
};