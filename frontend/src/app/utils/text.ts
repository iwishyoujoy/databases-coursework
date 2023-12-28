export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getItemsListLength = (items) => {
    if (items.length === 1){
        return '1 item';
    }
    else {
        return `${items.length} items`;
    }
}