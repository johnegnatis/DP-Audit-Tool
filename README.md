# Senior Project Generic Team Name :D

## Install

- You'll need to have installed Nodejs 19.8.1 (https://nodejs.org/en/)
- You’ll need to have Python >= 3.6, Eel, pyinstaller.

## Setup Development Environment

```
$ git clone --recurse-submodules https://github.com/johnegnatis/Senior-Project.git
$ pip install -e ./Eel ( installs our edited version of the Eel library )
$ pip install <all other dependencies>
$ yarn install
```

## Create Executable

```
$ yarn build
```
- **Warning**, make sure you have these lines uncommented in ./index.py
```py
sys.stdout = io.StringIO() # to fix --no console, must be the first three lines, so we cannot use NO_CONSOLE flag
sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654
```

Alternatively, if you wish to have the console you can run the following command. The two lines above should be commented out in this case.
```
$ yarn build-dev
```

- Executable in /dist