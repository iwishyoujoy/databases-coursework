import axios from "axios";

export async function getProductById(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/product/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getProductsBySellerId(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/product/seller/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getProceduresByClinicId(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/clinic/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getCategoryById(id: number, type: 'product' | 'procedure'): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/${type}Category/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getAllCategories(categoryType: 'productCategory' | 'procedureCategory'): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/${categoryType}/all`);
     
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getSellerOrClinicById(id: number, type: 'seller' | 'clinic'): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/${type}/id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getSellerOrClinicByLogin(login: string, type: 'seller' | 'clinic'): Promise<any> {
    try {
        const response = await axios.get(type === 'seller' ? `http://localhost:3100/api/seller/login/${login}` : `http://localhost:3100/api/clinic/${login}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getReviewsById(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/review/item-id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getProcedureById(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getAppointmentsById(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/${id}/appointments`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}


export async function getCheckForOrder(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/order/check/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getAllProducts(): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/product/all`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getAllProcedures(): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/all`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getProductsbyCategory(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/productCategory/${id}/products`);
     
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
 }

export async function getProceduresbyCategory(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedureCategory/${id}/procedures`);
     
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getCustomerData(login: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/customer/${login}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getOrdersForCustomer(login: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/order/customer/${login}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getFavoritesByCustomer(login: string): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/favorite/all/${login}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getItemsFromOrder(order_id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/item_in_order/all/${order_id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function getOrderById(id: number): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/order/one/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}