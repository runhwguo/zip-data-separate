# zip-data-separate
zip large data to separate files with 7z.

## usage
### step 1

````
const {zipFiles} = require('zip-data-separate');

// sourceDir or destinationDir not exist.

// --> /Users/runhwguo/runhwguo/project/test/6t or /Users/runhwguo/temp1 not exist
zipFiles('/Users/runhwguo/runhwguo/project/test/6t',
  '/Users/runhwguo/temp1',
  5 * 1024 * 1024 * 1024, ['.wav']).then(result => {
  console.log(result);
}).catch(result => {
  console.log(result);
});


// do not specify file extension means all to zip(includes directions).
// maxSize default is 2G.

// --> ok, generate zip.sh and lists in /Users/runhwguo/temp
zipFiles('/Users/runhwguo/runhwguo/software/android-ndk-r7c',
  '/Users/runhwguo/temp').then(result => {
  console.log(result);
}).catch(result => {
  console.log(result);
});

// specify large size,eg. 50G

// --> ok, generate zip.sh and lists in /Users/runhwguo/temp
zipFiles('/Users/runhwguo/runhwguo/project/test/temp',
  '/Users/runhwguo/temp',
  50 * 1024 * 1024 * 1024, ['.wav']).then(result => {
  console.log(result);
}).catch(result => {
  console.log(result);
});
````
### step 2

````
1.go to destinationDir
2.execute zip.sh
3.wait script to execute to generate *.7z
````