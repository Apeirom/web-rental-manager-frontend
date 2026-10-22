import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { DashboardLayout } from 'components/DashboardLayout';
import {
    Description,
    PageHeader,
    ReportIcon,
    ReportInfo,
    ReportList,
    ReportLink,
    Title
} from './styles';

const reports = [
    {
        key: 'carne-leao',
        href: '/relatorios/carne-leao',
        title: 'Carnê-Leão',
        description:
            'Consulte rendimentos e deduções recebidos, confira o resumo e exporte os lançamentos.',
        status: 'Disponível'
    }
];

const ReportsPage: React.FC = () => (
    <>
        <Head>
            <title>Relatórios | Rental Manager</title>
        </Head>
        <DashboardLayout>
            <PageHeader>
                <Title>Relatórios</Title>
                <Description>
                    Selecione um relatório para consultar informações da sua
                    gestão.
                </Description>
            </PageHeader>

            <ReportList aria-label="Relatórios disponíveis">
                {reports.map((report) => (
                    <Link key={report.key} href={report.href} passHref>
                        <ReportLink>
                            <ReportIcon aria-hidden="true">
                                <FileTextOutlined />
                            </ReportIcon>
                            <ReportInfo>
                                <h2>{report.title}</h2>
                                <p>{report.description}</p>
                            </ReportInfo>
                            <span>
                                {report.status} <ArrowRightOutlined />
                            </span>
                        </ReportLink>
                    </Link>
                ))}
            </ReportList>
        </DashboardLayout>
    </>
);

export default ReportsPage;
