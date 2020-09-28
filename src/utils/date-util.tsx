export const formatDate = (date: Date | null): string => {
    const parsed = parseDate(date);
    if (parsed === null) {
        return 'Ingen dato satt';
    }
    return `${parsed.date}.${parsed.month}.${parsed.year}`;
};

const isValidDate = (date: Date): boolean => {
    return !isNaN(date.getTime());
};

export const isValidDateString = (date: string): boolean => {
    return !Number.isNaN(Date.parse(date));
};

export const toISOString = (date: Date): string => {
    const parsed = parseDate(date);
    if (parsed === null) {
        return '';
    }
    return `${parsed.year}-${parsed.month}-${parsed.date}`;
};

const dateRegex = /^\d{2}.\d{2}\.\d{4}$/;

export const parseDateString = (formattedDate: string): Date | null => {
    if (!dateRegex.test(formattedDate)) {
        return null;
    }
    const toParse = formattedDate.split('.').reverse().join('-');
    const parsed = new Date(toParse);
    if (isValidDate(parsed)) {
        return parsed;
    }
    return null;
};

export interface ParsedDate {
    year: string;
    month: string;
    date: string;
}

export const parseDate = (date: Date | null): ParsedDate | null => {
    if (date !== null && isValidDate(date)) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return {
            year: year.toString(),
            month: pad(month),
            date: pad(day)
        };
    }
    return null;
};

function pad(number: number): string {
    if (number < 10) {
        return `0${number}`;
    }
    return number.toString();
}
