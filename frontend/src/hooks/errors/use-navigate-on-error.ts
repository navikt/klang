import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useGoToBegrunnelseOnError = (isValid: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValid) {
      navigate('../begrunnelse', { replace: true });
    }
  }, [isValid, navigate]);
};
