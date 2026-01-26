import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useAppSelector } from '@app/redux/configure-store';
import { getLoginRedirectPath } from '@app/user/login';
import { BodyShort, Button, HStack, Modal, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const LoggedOutModal = () => {
  const { show } = useAppSelector(({ loggedOutModal }) => loggedOutModal);
  const { skjema } = useTranslation();

  useEffect(() => {
    if (show) {
      appEvent(AppEventEnum.LOGGED_OUT_MODAL_OPEN);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const { loggedOut, login, logout, yes } = skjema.begrunnelse.loggedOutModal;

  return (
    <Modal
      open
      onClose={() => undefined}
      header={{ heading: loggedOut, closeButton: false }}
      style={{ padding: 'var(--ax-space-20)' }}
    >
      <Modal.Body>
        <VStack gap="space-16">
          <BodyShort>{login}</BodyShort>

          <HStack gap="space-16">
            <Button as={Link} to={getLoginRedirectPath()}>
              {yes}
            </Button>
            <Button as={Link} to="/oauth2/logout" variant="secondary">
              {logout}
            </Button>
          </HStack>
        </VStack>
      </Modal.Body>
    </Modal>
  );
};
