import { Login } from "../model/Login";


interface ProductResponse {
  success: boolean;
  data?: Product[];
  message?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  dateEntry: string;
}
export interface OrderProduct {
  productId: string;
  qty: number;
}

export interface Order {
  userId: string;
  client: string;
  products: OrderProduct[];
}


export const LoginConection = async ({ email, password }: Login) => {
  try {
    const response = await fetch(
      "https://dev-013-burger-queen-api-two.vercel.app/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.error }; // Retorna el mensaje de error
    }
    const data = await response.json();
    console.log("data", data);
    localStorage.setItem("token", data.accessToken);

    console.log("Login exitoso", data);
    return { success: true,data:data};
  } catch (error) {
    console.error("Error", (error as Error).message);
    return { success: false, message: "Error en la conexión" };
  }
};

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await fetch(
      "https://dev-013-burger-queen-api-two.vercel.app/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.error };
    }

    const data = await response.json();
    console.log(data)
    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener productos:", (error as Error).message);
    return { success: false, message: "Error en la conexión" };
  }
};

export const postOrders = async(order:Order) =>{
  try {
    const response = await fetch("https://dev-013-burger-queen-api-two.vercel.app/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error submitting order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting order:", error);
    return { success: false, message: "Error en la conexión" };
  }
}
