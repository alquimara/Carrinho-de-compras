import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';
import useEffect from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}



const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  

  const cartFormatted = cart.map(product => ({
    ...product,
    priceFormatted:formatPrice(product.price),
    subtotal:formatPrice(product.amount * product.price)
  }))

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal + product.amount * product.price;
      }, 0)
    
    )

  function handleProductIncrement(product: Product) {
    updateProductAmount({productId:product.id,amount:product.amount + 1})
     
  }

   
  function handleProductDecrement(product: Product) {
    updateProductAmount({productId:product.id,amount:product.amount - 1})
     
   
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((item) => (
            <tr key={item.id} data-testid="product">
            <td>
              <img src={item.image} />
            </td>
            <td>
              <strong>{item.title}</strong>
              <span>{item.priceFormatted}</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                disabled={item.amount <= 1}
                onClick={() => handleProductDecrement(item)}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="number"
                  data-testid="product-amount"
                  readOnly
                  value={item.amount}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                onClick={() => handleProductIncrement(item)}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>{item.subtotal}</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
              onClick={() => handleRemoveProduct(item.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
