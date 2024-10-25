import { useState, useEffect } from "react";
import { getProducts, Product, Order, postOrders } from "../service/ApiService";
import {
  IoIosAddCircle,
  IoIosTrash,
  IoMdClock,
  IoIosRemoveCircle,
} from "react-icons/io";
import "../styles/Dashboard.css";
import { Clock } from "./Clock";

export const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const userId = localStorage.getItem("userId");

  const fetchProducts = async () => {
    const result = await getProducts();

    if (result.success) {
      setProducts(result.data || []);
    } else {
      alert(result.message);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesType = selectedType
        ? selectedType === "Almuerzo y cena"
          ? product.type === "Almuerzo" || product.type === "Cena" // Muestra tanto almuerzos como desayunos
          : product.type === selectedType
        : true;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [products, selectedType, searchTerm]);

  const addToCart = (product: Product) => {
    const existingProduct = cart.find(
      (item) => item.product._id === product._id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product._id !== productId));
  };
  const increaseQuantity = (productId: string) => {
    setCart(
      cart.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart(
      cart.map((item) =>
        item.product._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleSubmitOrder = async () => {
    if (!userId) {
      alert("No se encontró el ID de usuario. Por favor, inicia sesión.");
      return;
    }
    const order: Order = {
      userId: userId,
      client: clientName,
      products: cart.map((item) => ({
        productId: item.product._id,
        qty: item.quantity,
      })),
    };
    console.log("Enviando orden:", order);
    const result = await postOrders(order);

    if (result.success) {
      alert("Orden enviada con éxito: " + result.message);
      setCart([]); // Limpiar el carrito
      setClientName("");
    } else {
      alert("Error al enviar la orden: " + result.message);
    }
  };
  // Calcular el subtotal total
  const getTotal = () => {
    return cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };
  return (
    <div className="dashboard">
      <section className="section-left">
        <h1 className="list-products">Lista de Productos</h1>
        <div className="navbar-products">
          <div className="button-nav">
            <button onClick={() => setSelectedType("Desayuno")}>
              Desayuno
            </button>
            <button onClick={() => setSelectedType("Almuerzo y cena")}>
              Almuerzo y cena
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="catalog-products">
          {filteredProducts.length > 0 ? (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Tipo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="product-card">
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>S/.{product.price}</td>
                    <td>{product.type}</td>
                    <td>
                      <IoIosAddCircle
                        className="add-product"
                        onClick={() => addToCart(product)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </section>
      <section className="section-right">
        <div className="clock-order">
          <IoMdClock className="clock-icon" />
          <Clock />
        </div>
        <div>
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)} // Manejar el cambio en el nombre del cliente
          />
        </div>
        <div className="table-order">
          <table className="list-price">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <tr key={item.product._id}>
                    <td>{item.product.name}</td>
                    <td>
                      <div className="quantity-control">
                        <IoIosRemoveCircle
                          className="remove-quantity"
                          onClick={() => {
                            decreaseQuantity(item.product._id); // Decrementar la cantidad
                          }}
                        />
                        <span>{item.quantity}</span>
                        <IoIosAddCircle
                          className="add-quantity"
                          onClick={() => increaseQuantity(item.product._id)}
                        />
                      </div>
                    </td>
                    <td>S/.{item.product.price * item.quantity}</td>
                    <td>
                      <IoIosTrash
                        className="remove-product"
                        onClick={() => removeFromCart(item.product._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="no-Products">
                    No hay productos en el carrito.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <strong>Subtotal</strong>
                </td>
                <td>
                  <strong>S/.{getTotal()}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <button onClick={handleSubmitOrder} className="submit-order">
            {" "}
            Enviar Orden
          </button>
        </div>
      </section>
    </div>
  );
};
