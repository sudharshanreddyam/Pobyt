This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

<img src="https://github.com/sudharshanreddyam/Pobyt/blob/master/preview.gif" width="360" height="640" />

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start mySideMenu sidemenu
```

Then, to run it, cd into `mySideMenu` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

common git commands
```bash
check-out: git clone 'url'
check-in:
	git add .
	git commit -m "comment"
	git push -u origin master
status: git status
difference:git diff
update: git pull origin master
build in ionic pro:git push ionic master
```

[publishing](https://ionicframework.com/docs/intro/deploying/).
```bash
ionic cordova build android --prod --release

keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias

set below location in environament variables
C:\Users\%user%\AppData\Local\Android\sdk\build-tools\26.0.0

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <path-to-debug-or-production-keystore> <path-to-android-release-unsigned.apk> my-alias

zipalign -v 4 <path-to-android-release-unsigned.apk> <path-to-appname.apk>

apksigner verify <path-to-appname.apk>
```
[facebook integration](http://ionicframework.com/docs/native/facebook/).
```bash
$ keytool -exportcert -keystore <path-to-debug-or-production-keystore> -list -v -alias <alias-name>
copy SHA1 key from above command pass as input below tool
Key Hash:http://tomeko.net/online_tools/hex_to_base64.php?lang=en
```
[google integration](https://github.com/EddyVerbruggen/cordova-plugin-googleplus/).


https://forum.ionicframework.com/t/ionic-cli-3-10-3-error-cannot-find-module-inquirer/105309

rm -rf node_modules 
npm cache clean --force
remove package-lock.json
npm install

one-signal-documentation
https://documentation.onesignal.com/docs/generate-a-google-server-api-key
