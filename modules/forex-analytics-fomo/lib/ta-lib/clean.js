var exec = require('child_process').exec;

console.log('cleaning talib...');
var flags = "";
if (process.platform == 'darwin') {
  var arch = process.arch == 'ia32' ? 'i386' : process.arch == 'x64' ? 'x86_64' : process.arch;
  flags = 'export CFLAGS="-arch ' + arch + '" && export LDFLAGS="-arch ' + arch + '" && ';
}
process.chdir('./lib/ta-lib/make/csr/linux/g++/');
exec('rm -rf ./build && rm -rf ./node_modules && ' + flags + 'make clean');
