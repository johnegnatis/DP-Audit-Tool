# Degree Plan and Audit Tool

**Senior Project Team 6**

Created by Zia Kim, John Egnatis, Sai Gonuguntla, Haniyyah Hamid, Areeba Nandwani, Jered Hightower

## Setup Development Environment

**Requirements**
- Have installed Nodejs 19.8.1 (https://nodejs.org/en/)
- Have installed NPM package manager (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Have yarn installed (install through npm -OR- https://yarnpkg.com/)
- Have Python >= 3.6, Eel, pyinstaller.

```
$ git clone --recurse-submodules https://github.com/johnegnatis/DP-Audit-Tool.git
$ pip install -e ./Eel ( installs our edited version of the Eel library )
$ pip install <all other dependencies>
$ yarn install
$ yarn start -OR- yarn start:eel; yarn start:js; (splits up frontend and backend enviroment)
```

## Create Executable

```
$ yarn clean (removes local files, kills ports just incase)
$ yarn build-dev (builds with console, preffered because otherwise the port stays alive)
```

Alternatively, if you wish to hide the console you can run the following commands below.

```
$ yarn clean
$ yarn build
```

- **Warning**, make sure you have these lines uncommented in ./index.py if you wish to use the 'yarn build' command.

```py
sys.stdout = io.StringIO() # to fix --no console, must be the first three lines, so we cannot use NO_CONSOLE flag
sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654
```

- Executable in /dist

## Create Installer

- Check out ./installer/README.md for information on how to create a new installer from the application.
- This can only be done once an exectuable file has been generated (see above).
