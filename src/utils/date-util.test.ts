import { formatDate, isValidDateString, toISOString, parseDateString, parseDate, ParsedDate } from './date-util';

describe('Extract properties from Date', () => {
    it('Should extract year, month and date from a valid date', () => {
        const date = new Date('2020-01-31T23:59:59.999Z');
        const parsed = parseDate(date);
        const expected: ParsedDate = {
            date: '31',
            month: '01',
            year: '2020'
        };
        expect(parsed).toStrictEqual(expected);
    });
});

describe('Date formatting', () => {
    it('Should format a valid date with pattert DD.MM.YYYY', () => {
        const validDate = new Date('2012-12-31');
        const formattedDate = formatDate(validDate);
        expect(formattedDate).toBe('31.12.2012');
    });

    it('Should return a default string for invalid dates', () => {
        const invalidDate = new Date('2012-13-31');
        const formattedDate = formatDate(invalidDate);
        expect(formattedDate).toBe('Ingen dato satt');
    });
});

describe('Date validation', () => {
    it('Should validate valid date strings', () => {
        expect(isValidDateString('2012-12-13')).toBe(true);
    });

    it('Should not validate invalid date strings', () => {
        expect(isValidDateString('2012-13-12')).toBe(false);
    });

    it('Should not validate non-date strings', () => {
        expect(isValidDateString('Not a date at all.')).toBe(false);
    });
});

describe('Date ISO formatting', () => {
    it('Should not format invalid dates', () => {
        expect(toISOString(new Date('2019-01-32'))).toBe('');
    });

    it('Should format valid dates', () => {
        expect(toISOString(new Date('2012-01-31'))).toBe('2012-01-31');
    });
});

describe('Date string parsing', () => {
    it('Should parse a valid date string to a Date object', () => {
        const dateString = '31.12.2020';
        const parsed = parseDateString(dateString);
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed).toStrictEqual(new Date('2020-12-31T00:00:00.000Z'));
    });

    it('Should NOT parse an invalid date string to a Date object', () => {
        const dateString = '32.12.2020';
        const parsed = parseDateString(dateString);
        expect(parsed).toBeNull();
    });

    it('Should parse an invalid string to null', () => {
        const dateString = 'Not a date at all.';
        const parsed = parseDateString(dateString);
        expect(parsed).toBeNull();
    });
});
