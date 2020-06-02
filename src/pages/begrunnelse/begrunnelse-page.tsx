import React from 'react';
import Begrunnelse from '../../components/begrunnelse/begrunnelse';

const BegrunnelsePage = (props: any) => (
    <Begrunnelse
        activeBegrunnelse={props.activeBegrunnelse}
        submitBegrunnelse={(activeBegrunnelse: string) => props.submitBegrunnelse(activeBegrunnelse)}
    />
);

export default BegrunnelsePage;
