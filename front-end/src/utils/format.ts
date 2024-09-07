const formatDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    return date.toLocaleString('vi-VN', options).replace(',', '');
}

const formatMonthYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        month: 'long', 
        year: 'numeric', 
    };
    return date.toLocaleDateString('vi-VN', options);
};

const formatCurrencyVND = (amount: number | undefined): string | undefined => {
    return amount?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

const formatTimeTypeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return 'vài giây trước';
    } else if (minutes < 60) {
        return `${minutes} phút trước`;
    } else if (hours < 24) {
        return `${hours} giờ trước`;
    } else if (days < 30) {
        return `${days} ngày trước`;
    } else if (months < 12) {
        return `${months} tháng trước`;
    } else {
        return `${years} năm trước`;
    }
}

export { formatCurrencyVND, formatDateTime, formatTimeTypeAgo, formatMonthYear }