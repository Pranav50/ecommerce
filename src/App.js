import { useEffect, useState } from "react";
import { Products, Navbar, Cart, Checkout} from "./components";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom' 
import {commerce} from "./lib/commerce";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  const fetchProducts = async () => {
    const {data} = await commerce.products.list()

    setProducts(data)
  }

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve())
  }

  const handleAddToCart = async (productId, quantity) => {  
    const item = await commerce.cart.add(productId, quantity)

    setCart(item.cart)
  }

  const handleUpdateCartQty = async (productId, quantity) => {  
    const response = await commerce.cart.update(productId, {quantity})

    setCart(response.cart)
  }

  const handleRemoveFromCart = async (productId) => {  
    const response = await commerce.cart.remove(productId)

    setCart(response.cart)
  }

  const handleEmptyCart = async () => {  
    const response = await commerce.cart.empty()

    setCart(response.cart)
  }

  const refreshCart = async () => {
    const newcart = await commerce.cart.refresh();
    setCart(newcart)
  }

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
      setOrder(incomingOrder)
      refreshCart()
    } catch(error) {
      setErrorMessage(error.data.error.message)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])
 
  return (
    <Router>
          <div>
            <Navbar totalItems={cart.total_items} />
            <Switch>
                <Route exact path="/">
                  <Products products={products} onAddToCart={handleAddToCart} />
                </Route>
                <Route exact path="/cart">
                  <Cart cart={cart} 
                        handleUpdateCartQty={handleUpdateCartQty}
                        handleEmptyCart={handleEmptyCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                  />
                </Route>
                <Route exact path="/checkout">
                  <Checkout 
                    cart={cart}
                    order={order}
                    onCaptureCheckout={handleCaptureCheckout}
                    error={errorMessage}
                  />
                  {/* <Checkout/> */}
                </Route>
            </Switch>
          </div>
    </Router>
  );
}

export default App;