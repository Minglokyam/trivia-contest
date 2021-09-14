export const checkToday = (updatedDate) => {
    return new Date(parseInt(updatedDate)).toLocaleDateString() === new Date().toLocaleDateString();
};