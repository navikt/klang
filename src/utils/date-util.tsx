import moment from 'moment';
import 'moment/locale/nb';

// TODO: Make date format/locale dynamic

export const formatDate = (date: Date | undefined): string => {
    const dateObj = moment(date);

    if (dateObj.isValid()) {
        return dateObj.locale('nb').format('L');
    }

    return 'Ingen dato satt';
};

export const toISOString = (date: Date): string => {
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.toISOString(true).substring(0, 10) : '';
};

export const dateStringToDate = (input: string): Date => moment(input, 'DD-MM-YYYY').toDate();
