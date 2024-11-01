import { LOWER_CASE_INNSENDINGSYTELSER } from '@app/innsendingsytelser';
import { CASE_TYPES, LANGUAGES, LOGGED_IN_STEPS, STEPS } from '@app/plugins/serve-index/segments';

export const getAnonymousPaths = (): string[] => {
  const paths: string[] = [];

  for (const lang of LANGUAGES) {
    for (const type of CASE_TYPES) {
      for (const ytelse of LOWER_CASE_INNSENDINGSYTELSER) {
        paths.push(`/${lang}/${type}/${ytelse}`);
        paths.push(`/${lang}/ettersendelse/${type}/${ytelse}`);

        for (const step of STEPS) {
          paths.push(`/${lang}/${type}/${ytelse}/${step}`);
          paths.push(`/${lang}/ettersendelse/${type}/${ytelse}/${step}`);
        }
      }
    }
  }

  return paths;
};

export const getLoggedInPaths = (): string[] => {
  const paths: string[] = [];

  for (const lang of LANGUAGES) {
    paths.push(`/${lang}/sak/:id`);

    for (const step of STEPS) {
      paths.push(`/${lang}/sak/:id/${step}`);
    }

    for (const step of LOGGED_IN_STEPS) {
      paths.push(`/${lang}/sak/:id/${step}`);
    }
  }

  return paths;
};
