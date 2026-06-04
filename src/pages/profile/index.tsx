import { NextPage } from 'next';
import Head from 'next/head';
import ProfilePage from 'template/Perfil';

const ControlePage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Profile | Rental Manager</title>
            </Head>
            <ProfilePage />
        </>
    );
};

export default ControlePage;
