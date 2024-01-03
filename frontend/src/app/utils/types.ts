export interface IProductProps{
    id_item: number;
    name: string;
    price: number;
    description: string;
    photo_url: string;
    amount_available: number;
    seller_id: number;
    product_category_id: number;
}

export interface IProcedureProps{
    id: number;
    photo_url: string;
    name: string;
    price: number;
    procedure_category_id: number;
    clinic_id: number;
}

export interface ICategoryProps {
    id: number;
    name: string;
    description: string;
}

export interface ISellerOrClinicProps {
    id: number;
    name: string;
    email: string;
    contact: string;
    login: string;
    password: string;
}

export interface IAppointmentProps {
    item_id: number;
    date_time: string;
    procedure_id: number;
    status: boolean;
}

export interface IReviewProps {
    id: number;
    customer_id: number;
    surname: string;
    name: string;
    rating: number;
    content: string;
    item_id: number;
}

export interface IOrderProps {
    id: number;
    customer_id: string;
    status: string;
    timestamp: string;
}

export interface ICustomerProps {
    id: number;
    name: string;
    surname: string;
    birthday: string;
    phone_number: string;
    login: string;
    password: string;
}