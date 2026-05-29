import { NextPage } from 'next';
import Head from 'next/head';
// Aquele arquivão com as Tabs que criamos na resposta anterior seria o seu template de controle
import ControlTemplate from 'template/Control';

const ControlePage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Controle | Rental Manager</title>
            </Head>
            <ControlTemplate />
        </>
    );
};

export default ControlePage;
