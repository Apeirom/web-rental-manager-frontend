import styled from 'styled-components';
import { InputNumber, DatePicker, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export const FilterInputNumber = styled(InputNumber)`
    width: 180px;
`;

export const FilterRangePicker = styled(RangePicker)`
    width: 260px;
`;

export const FilterSelect = styled(Select)`
    width: 150px;
`;

export const ExtractKeyText = styled.span`
    color: ${({ theme }) => theme.colors?.slate10 || '#868e96'};
    font-size: 12px;
`;

export const StyledEditIcon = styled(EditOutlined)`
    color: ${({ theme }) => theme.colors?.blue9 || '#0e90e2'};
`;
