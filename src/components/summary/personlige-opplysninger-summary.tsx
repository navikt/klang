import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Bruker, Adresse, displayAddress, displayPoststed } from '../../types/bruker';
import InformationPointBox from '../general/information-point-box';
import { PointsFlexListContainer } from '../../styled-components/main-styled-components';
import { foedselsnrFormat } from '../../utils/text-formatting';

const PERSONLIGE_OPPLYSNINGER_POINTS = [
    {
        displayName: 'For- og mellomnavn',
        content: (person: Bruker) => <Normaltekst>{combineFirstMiddleName(person)}</Normaltekst>
    },
    { displayName: 'Etternavn', content: (person: Bruker) => <Normaltekst>{person.navn.etternavn ?? ''}</Normaltekst> },
    {
        displayName: 'Fødselsnummer',
        content: (person: Bruker) => (
            <Normaltekst>
                {foedselsnrFormat(person.folkeregisteridentifikator?.identifikasjonsnummer ?? '')}
            </Normaltekst>
        )
    },
    {
        displayName: 'Telefonnummer',
        content: (person: Bruker) => <Normaltekst>{person.kontaktinformasjon?.telefonnummer ?? ''}</Normaltekst>
    },
    {
        displayName: 'Adresse',
        content: (person: Bruker) => (person.adresse ? <AddressPointBox adress={person.adresse} /> : '')
    }
];

const combineFirstMiddleName = ({ navn: { fornavn, mellomnavn } }: Bruker) =>
    [fornavn, mellomnavn].filter(n => !!n?.trim()).join(' ');

const AddressPointBox = ({ adress }: { adress: Adresse }) => (
    <div>
        <Normaltekst>{displayAddress(adress)}</Normaltekst>
        <Normaltekst>{displayPoststed(adress)}</Normaltekst>
    </div>
);

interface Props {
    person: Bruker;
}

const PersonligeOpplysningerSummary = (props: Props) => (
    <>
        <PointsFlexListContainer>
            {PERSONLIGE_OPPLYSNINGER_POINTS.map(point => (
                <InformationPointBox
                    key={point.displayName}
                    header={point.displayName}
                    info={point.content(props.person)}
                />
            ))}
        </PointsFlexListContainer>
    </>
);

export default PersonligeOpplysningerSummary;
