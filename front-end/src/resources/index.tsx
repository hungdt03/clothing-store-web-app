import { OrderStatusType } from "../constants/OrderStatus";

export type ReportResource = {
    products: number;
    categories: number;
    orders: number;
    accounts: number;
    newestOrders: OrderResource[];
}

export type ProductReport = {
    product: ProductResource;
    quantity: number;
}

export type ReviewShowResource = {
    id: number;
    evaluation: EvaluationResource
}

export type SlideShowResource = {
    id: number;
    title: string;
    description: string;
    btnTitle: string;
    backgroundImage: string;
}

export type BlogResource = {
    id: number;
    content: string;
    title: string;
    textPlain: string;
    createdDate: Date;
    user: UserResource;
    isHidden: boolean;
    thumbnail: string
}

export type OrderReport = {
    month: number;
    total: number;
    percent: number
}

export type OrderReportByMonth = {
    orderStatus: OrderStatusType;
    total: number;
    percent: number;
}

export type CategoryResource = {
    id: number;
    name: string;
    description: string;
    parentCategory: CategoryResource;
}

export type CategoryLevelResource = {
    id: number;
    name: string;
    description: string;
    categoryChildren: CategoryLevelResource[]
}

export type BrandResource = {
    id: number;
    name: string;
    description: string;
}

export type ColorResource = {
    id: number;
    name: string;
    hexCode: string;
}

export interface MessageResource {
    id: number;
    content: string;
    sender: UserResource;
    recipient: UserResource;
    sentAt: Date;
    images: string[];
}


export type SizeResource = {
    id: number;
    eSize: string;
    minHeight: number;
    minWeight: number;
    maxHeight: number;
    maxWeight: number;
}

export type ProductResource = {
    id: number;
    name: string;
    description: string;
    oldPrice: number;
    price: number;
    purchasePrice: number;
    quantity: number;
    thumbnail: string;
    zoomImage: string;
    category: CategoryResource;
    brand: BrandResource;
    images: ImageResource[]

}

export type VariantResource = {
    id: number;
    inStock: number;
    color: ColorResource;
    size: SizeResource;
    product: ProductResource;
    images: ImageResource[];
    thumbnailUrl: string;
}

export type ImageResource = {
    id: number;
    url: string;
}

export type RoleResource = {
    id: string;
    name: string;
    normalizedName: string;
    concurrencyStamp: string;
}

export type NotificationType = "order" | "message"

export type NotificationResource = {
    id: number;
    title: string;
    content: string;
    notificationType: NotificationType;
    referenceId: number;
    haveRead: boolean;
    createdAt: Date;
    recipient: UserResource;
}

export type UserResource = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    coverImage: string;
    roles: string[];
    isLocked: boolean;
    username: string;
    isOnline: boolean;
    recentOnlineTime: Date;
}

export type UserContactResource = {
    user: UserResource;
    message: MessageResource;

}

export type AuthResponse = {
    user?: UserResource;
    accessToken?: string;
}

export type CartResource = {
    total: number;
    cartItems: CartItemResource[]
}

export type AddressOrderResource = {
    id: number;
    fullName: string;
    isDefault: boolean;
    email: string;
    phoneNumber: string;
    address: string;
}

export type OrderResource = {
    id: number;
    createdAt: Date;
    title: string;
    thumbnailUrl: string;
    quantity: number;
    totalPrice: number;
    note: string;
    orderStatus: string;
    orderSteps: OrderProcessItem[]
    items: OrderItemResource[];
    payment: PaymentResource;
    addressOrder: AddressOrderResource;
    user: UserResource;
};

export type OrderProcessItem = {
    modifyAt: Date;
    orderStatus: string;
    note: string;
    isCompleted: boolean;
}

export type OrderItemResource = {
    id?: number;
    price?: number;
    subTotal?: number;
    productId?: number;
    quantity: number;
    productName?: string;
    productPrice?: number;
    variant?: VariantResource;
};

export type PaymentResource = {
    paymentMethod: string;
    createdDate: Date;
    status: boolean;
    paymentCode: string;
};

export type CartItemResource = {
    variant: VariantResource;
    product: ProductResource
    quantity: number;
    price: number;
    subTotal: number;
}

export interface BaseResponse {
    statusCode: number;
    message: string;
    success: boolean;
}

export interface DataResponse<T> extends BaseResponse {
    data: T
}

export interface PaginationResponse<T> extends BaseResponse {
    data: T;
    pagination: Pagination
}

export type Pagination = {
    totalItems: number;
    totalPages: number;
    pageIndex: number;
    pageSize: number;
}

export type EvaluationResource = {
    id: number;
    content: string;
    stars: number;
    createdAt: Date;
    user?: UserResource;
    favorites: number;
    isFavoriteIncludeMe: boolean;
};

export type AnalyticEvaluationResource = {
    totalEvaluation: number;
    starsPercents: StarPercent[];
    averageStar: number;
};

export type StarPercent = {
    star: number;
    totalEvaluation: number;
    percent: number;
};

export type ReportEvaluationResource = {
    results: EvaluationResource[];
    report: AnalyticEvaluationResource;
};