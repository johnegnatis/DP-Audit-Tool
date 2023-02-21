# Senior Project Generic Team Name :D

## Install

You'll need to have installed the latest version of nodejs. (https://nodejs.org/en/)

You’ll need to have Python >= 3.6, Eel, pyinstaller.

## Setup Development Environment

[Need Help? Errors?](#development-environment-help)

```
$ pip install eel
$ pip install pyinstaller
$ pip install tk
$ pip list (make sure eel and pyinstaller appear)

```

```
$ yarn install
$ yarn start
```

## Notes

https://github.com/python-eel/Eel/issues/654

## Development Environment Help

[Error Code 1](#error-code-1)

### Error Code 1

If you are getting error code 1 from npm run start (or more specifically: npm run start:eel), this is most likely because eel is not properly installed or pip is not pointing your current version of python. You can check this by doing 'pip list' and looking for eel.
