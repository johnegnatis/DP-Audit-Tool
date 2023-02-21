export const extractErrorMessage = (errorText) => {
    return errorText.replace('Exception(\'', '').replace('\')', '')
}