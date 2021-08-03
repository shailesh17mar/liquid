const debianInstaller = require('electron-installer-debian')

const packageFile = require('./../package.json')
const version = packageFile.version
const platform = process.argv.find(arg => arg.match('platform')).split('=')[1]

function toTarget (platform) {
  switch (platform) {
    case 'amd64':
      return 'linuxAmd64'
    case 'armhf':
      return 'raspi'
    case 'arm64':
      return 'linuxArm64'
    default:
      return platform
  }
}

require('./createPackage.js')(toTarget(platform)).then(function (appPaths) {
  var installerOptions = {
    src: appPaths[0],
    dest: 'dist/app',
    arch: platform,
    productName: 'Min',
    genericName: 'Web Browser',
    version: version,
    section: 'web',
    homepage: 'https://minbrowser.github.io/min/',
    icon: 'icons/icon256.png',
    categories: ['Network', 'WebBrowser'],
    mimeType: ['x-scheme-handler/http', 'x-scheme-handler/https', 'text/html'],
    maintainer: 'Min Developers <280953907a@zoho.com>',
    description: 'Min is a fast, minimal browser that protects your privacy.',
    productDescription: 'A web browser with smarter search, improved tab management, and built-in ad blocking. Includes full-text history search, instant answers from DuckDuckGo, the ability to split tabs into groups, and more.',
    depends: [
      'libsecret-1-dev',
      'gconf2',
      'gconf-service',
      'libasound2',
      'libc6',
      'libcap2',
      'libgtk2.0-0',
      'libudev0 | libudev1',
      'libgcrypt11 | libgcrypt20',
      'libnotify4',
      'libnss3',
      'libxss1',
      'libxtst6',
      'python | python3',
      'xdg-utils'
    ],
    scripts: {
      postinst: 'resources/postinst_script',
      prerm: 'resources/prerm_script'
    }
  }

  console.log('Creating package (this may take a while)')

  debianInstaller(installerOptions)
    .then(() => console.log('Successfully created package.'))
    .catch(err => {
      console.error(err, err.stack)
      process.exit(1)
    })
})
