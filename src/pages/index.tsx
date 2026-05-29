import { NextPage } from 'next';
import Head from 'next/head';
import LoginTemplate from 'template/Login';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Login | Rental Manager</title>
            </Head>
            <LoginTemplate />
        </>
    );
};

export default Home;
