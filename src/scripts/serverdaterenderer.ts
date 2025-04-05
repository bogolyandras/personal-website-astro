const formatServerDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export { formatServerDate };