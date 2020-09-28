export const formatDate = (date: Date | null): string => {
    if (date !== null && isValidDate(date)) {
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = date.getDate();
        return `${day}.${month}.${year}`;
    }
    return 'Ingen dato satt';
};

const isValidDate = (date: Date): boolean => {
    return !isNaN(date.getTime());
};

export const isValidDateString = (date: string): boolean => {
    return !Number.isNaN(Date.parse(date));
};

export const toISOString = (date: Date): string => {
    return isValidDate(date)
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(0, 10)
        : '';
};

const dateRegex = /^\d{2}.\d{2}\.\d{4}$/;

export const parseDate = (formattedDate: string): Date | null => {
    if (!dateRegex.test(formattedDate)) {
        return null;
    }
    const toParse = formattedDate.split('.').reverse().join('-');
    return new Date(toParse);
};

function pad(number: number): string {
    if (number < 10) {
        return `0${number}`;
    }
    return number.toString();
}
