import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IAppointmentProps, ICategoryProps, ICustomerProps, IFavoriteItemProps, IItemInOrderProps, IOrderProps, IProcedureProps, IProductProps, IReviewProps, ISellerOrClinicProps } from './types'

interface ICategoryQueryProps {
    id: number,
    type: 'procedure' | 'product'
}

interface ISellerOrClinicQueryProps {
    id?: number,
    login?: string,
    type: 'seller' | 'clinic'
}

type CategoryType = 'productCategory' | 'procedureCategory'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3100/api/' }),
    endpoints: (builder) => ({
        getProductById: builder.query<IProductProps, number>({
            query: (id) => `product/${id}`
        }),
        getProductsBySellerId: builder.query<IProductProps[], number>({
            query: (id) => `product/seller/${id}`
        }),
        getProcedureById: builder.query<IProcedureProps, number>({
            query: (id) => `procedure/${id}`
        }),
        getProceduresByClinicId: builder.query<IProcedureProps[], number>({
            query: (id) => `procedure/clinic/${id}`
        }),
        getAppointmentsByProcedureId: builder.query<IAppointmentProps[], number>({
            query: (id) => `procedure/${id}/appointments`
        }),
        getCategoryById: builder.query<ICategoryProps, ICategoryQueryProps>({
            query: ({id, type}) => `${type}Category/${id}`
        }),
        getAllCategories: builder.query<ICategoryProps[], CategoryType>({
            query: (categoryType) => `${categoryType}/all`
        }),
        getSellerOrClinicById: builder.query<ISellerOrClinicProps, ISellerOrClinicQueryProps>({
            query: ({id, type}) => `${type}/id/${id}`
        }),
        getSellerOrClinicByLogin: builder.query<ISellerOrClinicProps, ISellerOrClinicQueryProps>({
            query: ({login, type}) => type === 'seller' ? `seller/login/${login}` : `clinic/${login}`
        }),
        getReviewsById: builder.query<IReviewProps, number>({
            query: (id) => `review/item-id/${id}`
        }),
        getCheckForOrder: builder.query<number, number>({
            query: (id) => `order/check/${id}`
        }),
        getAllProducts: builder.query<IProductProps[], void>({
            query: () => `product/all`,
        }),
        getAllProcedures: builder.query<IProcedureProps[], void>({
            query: () => `procedure/all`
        }),
        getProductsbyCategory: builder.query<IProductProps[], number>({
            query: (id) => `productCategory/${id}/products`
        }),
        getProceduresbyCategory: builder.query<IProcedureProps[], number>({
            query: (id) => `procedureCategory/${id}/procedures`
        }),
        getCustomerData: builder.query<ICustomerProps, string>({
            query: (login) => `customer/${login}`
        }),
        getOrdersForCustomer: builder.query<IOrderProps[], string>({
            query: (login) => `order/customer/${login}`
        }),
        getFavoritesByCustomer: builder.query<IFavoriteItemProps[], string>({
            query: (login) => `favorite/all/${login}`
        }),
        getItemsFromOrder: builder.query<IItemInOrderProps[], number>({
            query: (order_id) => `item_in_order/all/${order_id}`
        }),
        getOrderById: builder.query<IOrderProps, number>({
            query: (id) => `order/one/${id}`
        }),
        getAppointmentById: builder.query<IAppointmentProps, number>({
            query: (id) => `appointment/${id}`
        }),
        getOrderForSellerById: builder.query<IOrderProps, number>({
            query: (id) => `seller/order/${id}`
        }),
        getOrderForClinicById: builder.query<IOrderProps, number>({
            query: (id) => `clinic/order/${id}`
        })
    }),
})

export const { 
    useGetProductByIdQuery, 
    useGetAllCategoriesQuery, 
    useGetAllProceduresQuery, 
    useGetAllProductsQuery, 
    useGetAppointmentByIdQuery, 
    useGetAppointmentsByProcedureIdQuery, 
    useGetCategoryByIdQuery, 
    useGetCheckForOrderQuery, 
    useGetCustomerDataQuery, 
    useGetFavoritesByCustomerQuery, 
    useGetItemsFromOrderQuery, 
    useGetOrderByIdQuery, 
    useGetOrderForClinicByIdQuery, 
    useGetOrderForSellerByIdQuery, 
    useGetOrdersForCustomerQuery, 
    useGetProcedureByIdQuery, 
    useGetProceduresByClinicIdQuery, 
    useGetProceduresbyCategoryQuery, 
    useGetProductsBySellerIdQuery, 
    useGetProductsbyCategoryQuery, 
    useGetReviewsByIdQuery, 
    useGetSellerOrClinicByIdQuery, 
    useGetSellerOrClinicByLoginQuery } = api

export const { endpoints, reducerPath, reducer, middleware } = api
