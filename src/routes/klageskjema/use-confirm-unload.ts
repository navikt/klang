import { useEffect } from 'react';

const EVENT_NAME = 'beforeunload';

const handler = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = true;
};
const removeListener = () => window.removeEventListener(EVENT_NAME, handler);
const effect = () => {
    window.addEventListener(EVENT_NAME, handler);
    return removeListener;
};

export const useConfirmUnload = () => {
    useEffect(effect);
    return removeListener;
};
