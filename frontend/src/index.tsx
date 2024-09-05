import { initializeObservability } from '@app/observability';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';

initializeObservability();

if (import.meta.env.MODE === 'development') {
  // Remove all placeholder text nodes from the body.
  for (const node of document.body.childNodes) {
    const { nodeType, textContent } = node;

    if (nodeType === 3 && textContent !== null && textContent.includes('{{')) {
      document.body.removeChild(node);
    }
  }

  injectDecoratorClientSide({
    env: 'dev',
    params: {
      simple: true,
      chatbot: true,
      redirectToApp: true,
      logoutUrl: '/oauth2/logout',
      context: 'privatperson',
      level: 'Level4',
      logoutWarning: true,
    },
  });
}

const container = document.getElementById('root');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}
