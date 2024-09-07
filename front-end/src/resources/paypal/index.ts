export type Link = {
    href: string;
    rel: string;
    method: string;
};

export type CreateOrderResponse = {
    id: string;
    status: string;
    links: Link[];
};