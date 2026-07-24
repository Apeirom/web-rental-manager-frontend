import React from 'react';
import { Tabs } from 'antd';
import { DashboardLayout } from 'components/DashboardLayout';
import { ContractTable } from 'components/Tables/ContractTable';
import { TenantTable } from 'components/Tables/TenantTable';
import { PropertyTable } from 'components/Tables/PropertyTable';
import { RealEstateTable } from 'components/Tables/RealEstateTable';
import { GuaranteeTable } from 'components/Tables/GuaranteeTable';
import { PaymentTable } from 'components/Tables/PaymentTable';
import { ExtractTable } from 'components/Tables/ExtractTable';

const ControlePage: React.FC = () => {
    return (
        <DashboardLayout>
            <div style={{ marginBottom: '24px' }}>
                <h1
                    style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#212529',
                        marginBottom: '8px'
                    }}
                >
                    Painel de Controle
                </h1>
                <p style={{ color: '#868e96' }}>
                    Gerencie todas as entidades e contratos do sistema.
                </p>
            </div>

            <Tabs
                defaultActiveKey="contracts"
                type="card"
                items={[
                    {
                        label: 'Contratos',
                        key: 'contracts',
                        children: <ContractTable />
                    },
                    {
                        label: 'Extratos',
                        key: 'extracts',
                        children: <ExtractTable />
                    },
                    {
                        label: 'Pagamentos',
                        key: 'payments',
                        children: <PaymentTable />
                    },
                    {
                        label: 'Inquilinos',
                        key: 'tenants',
                        children: <TenantTable />
                    },
                    {
                        label: 'Imóveis',
                        key: 'properties',
                        children: <PropertyTable />
                    },
                    {
                        label: 'Imobiliárias',
                        key: 'real_estates',
                        children: <RealEstateTable />
                    },
                    {
                        label: 'Garantias',
                        key: 'guarantees',
                        children: <GuaranteeTable />
                    }
                ]}
            />
        </DashboardLayout>
    );
};

export default ControlePage;
