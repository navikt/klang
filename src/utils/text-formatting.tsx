export const foedselsnrFormat = (fnr: string) => {
    if (fnr.length === 11) {
        return fnr.substring(0, 6) + ' ' + fnr.substring(6);
    }
    return fnr;
};
