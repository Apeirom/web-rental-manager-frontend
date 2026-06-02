export interface IPaginatedResponse<T> {
    total: number;
    skip: number;
    limit: number;
    data: T[];
}
