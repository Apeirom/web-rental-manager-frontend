import {
    EXTRACT_ITEM_CATEGORIES,
    ExtractItemCategory,
    IExtractItemPayload
} from 'interfaces/extract';

export const findExtractItem = (
    items: IExtractItemPayload[],
    category: ExtractItemCategory
): IExtractItemPayload | undefined =>
    items.find((item) => item.category === category);

export const upsertExtractItem = (
    items: IExtractItemPayload[],
    category: ExtractItemCategory,
    amount: number
): IExtractItemPayload[] => {
    const existingItem = findExtractItem(items, category);
    const categoryDefinition = EXTRACT_ITEM_CATEGORIES[category];

    if (amount <= 0) {
        return items.filter((item) => item.category !== category);
    }

    const updatedItem: IExtractItemPayload = {
        key: existingItem?.key,
        category,
        description:
            existingItem?.description || categoryDefinition.description,
        amount,
        is_credit:
            existingItem?.is_credit ?? categoryDefinition.is_credit ?? false,
        is_withheld_at_source:
            existingItem?.is_withheld_at_source ??
            categoryDefinition.is_withheld_at_source ??
            false
    };

    if (!existingItem) return [...items, updatedItem];

    return items.map((item) =>
        item.category === category ? updatedItem : item
    );
};
