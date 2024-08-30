import { getCsrElements } from '@app/nav-dekoratoren/csr-elements';
import type { DecoratorFetchProps } from '@app/nav-dekoratoren/types';
import { getDecoratorUrl } from '@app/nav-dekoratoren/urls';
import { Window } from 'happy-dom';

type DecoratorElements = {
  DECORATOR_STYLES: string;
  DECORATOR_SCRIPTS: string;
  DECORATOR_HEADER: string;
  DECORATOR_FOOTER: string;
};

const fetchDecorator = async (url: string, props: DecoratorFetchProps, retries = 3): Promise<DecoratorElements> =>
  fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      throw new Error(`${res.status} - ${res.statusText}`);
    })
    .then((html) => {
      const window = new Window({
        settings: {
          disableJavaScriptFileLoading: true,
          disableCSSFileLoading: true,
          disableComputedStyleRendering: true,
          disableJavaScriptEvaluation: true,
        },
      });
      const { document } = window;

      document.write(html);

      const styles = document.getElementById('styles')?.innerHTML;
      if (!styles) {
        throw new Error('Decorator styles element not found!');
      }

      const scripts = document.getElementById('scripts')?.innerHTML;
      if (!scripts) {
        throw new Error('Decorator scripts element not found!');
      }

      const header = document.getElementById('header-withmenu')?.innerHTML;
      if (!header) {
        throw new Error('Decorator header element not found!');
      }

      const footer = document.getElementById('footer-withmenu')?.innerHTML;
      if (!footer) {
        throw new Error('Decorator footer element not found!');
      }

      const elements = {
        DECORATOR_STYLES: styles.trim(),
        DECORATOR_SCRIPTS: scripts.trim(),
        DECORATOR_HEADER: header.trim(),
        DECORATOR_FOOTER: footer.trim(),
      };

      document.close();
      window.close();

      return elements;
    })
    .catch((e) => {
      if (retries > 0) {
        console.warn(`Failed to fetch decorator, retrying ${retries} more times - Url: ${url} - Error: ${e}`);
        return fetchDecorator(url, props, retries - 1);
      }

      throw e;
    });

export const fetchDecoratorHtml = async (props: DecoratorFetchProps): Promise<DecoratorElements> => {
  const url = getDecoratorUrl(props);

  return fetchDecorator(url, props).catch((e) => {
    console.error(
      `Failed to fetch decorator, falling back to elements for client-side rendering - Url: ${url} - Error: ${e}`,
    );

    const csrElements = getCsrElements(props);

    return {
      DECORATOR_STYLES: csrElements.styles,
      DECORATOR_SCRIPTS: `${csrElements.env}${csrElements.scripts}`,
      DECORATOR_HEADER: csrElements.header,
      DECORATOR_FOOTER: csrElements.footer,
    };
  });
};
