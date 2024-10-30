import { isError } from '@app/functions/is-api-error';
import { useTranslation } from '@app/language/use-translation';
import { useUpdateCaseMutation } from '@app/redux-api/case/api';
import { getLoginRedirectPath } from '@app/user/login';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const LoggedOutModal = ({ fixedCacheKey }: { fixedCacheKey: string }) => {
  const [, { error }] = useUpdateCaseMutation({ fixedCacheKey });
  const { skjema } = useTranslation();

  const unauthorized = isError(error) && error.status === 401;

  if (!unauthorized) {
    return null;
  }

  const { loggedOut, login, logout, yes } = skjema.begrunnelse.loggedOutModal;

  return (
    <Modal
      open
      onClose={() => {}}
      header={{ heading: loggedOut, closeButton: false }}
      style={{ padding: 'var(--a-spacing-5)' }}
    >
      <ModalBody>
        <BodyShort>{login}</BodyShort>

        <Buttons>
          <Button as={Link} to={getLoginRedirectPath()}>
            {yes}
          </Button>
          <Button as={Link} to="/oauth2/logout" variant="secondary">
            {logout}
          </Button>
        </Buttons>
      </ModalBody>
    </Modal>
  );
};

const ModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
`;

const Buttons = styled.div`
  display: flex;
  gap: var(--a-spacing-4);
`;
