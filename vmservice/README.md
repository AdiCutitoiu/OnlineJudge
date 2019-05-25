To provision the windows vm:
1. Install the virtual box guest additions `Devices->Insert Guest Additions CD Image`
2. Download and install clang http://releases.llvm.org/download.html (add to PATH env var for all users)  
3. Download mingw https://kent.dl.sourceforge.net/project/mingw-w64/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z  
4. Extract to `C:` drive then add `C:\mingw64\bin` to your PATH env variable  
5. Download & install node https://nodejs.org/en/download/current/
6. Copy `register.js` and `service.js` to whatever folder eg: `C:\service`
7. In that folder open an elevated cmd and run the following:
```
npm install node-windows -g
npm link node-windows
node register.js
```
8. Create a provisioned snapshot
