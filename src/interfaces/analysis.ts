export interface IIncomeTaxRow {
    reference_date: string;
    tenant_name: string;

    // ATENÇÃO: Mantido como 'tenat' para bater com o Pydantic atual
    tenat_document_number: string;
    tenat_document_type: string;

    property_details: string;
    rent_amount: number;
    iptu: number;
    water: number;
    agreement: number;
    commission_amount: number;
    net_income: number;
}
