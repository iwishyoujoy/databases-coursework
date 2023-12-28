export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getItemsListLength = (items, one, more) => {
    if (items.length === 1){
        return `1 ${one}`;
    }
    else {
        return `${items.length} ${more}`;
    }
}

export const roundAmount = (amount) => {
    return Math.round(amount);
}