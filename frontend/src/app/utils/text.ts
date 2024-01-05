export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getItemsListLength = (items, one: string, more: string) => {
    if (items.length === 1){
        return `1 ${one}`;
    }
    else {
        return `${items.length} ${more}`;
    }
}

export const getItemsListLengthOnlyLength = (length: number, one: string, more: string) => {
    if (length === 1){
        return `1 ${one}`;
    }
    else {
        return `${length} ${more}`;
    }
}

export const roundAmount = (amount) => {
    return amount.toFixed(2);
}