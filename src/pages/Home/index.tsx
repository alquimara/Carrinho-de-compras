import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';



interface CartItemsAmount {
  [key: number]: number;
}

interface ProductFormatted extends Product {
  priceFormatted: String;
}

const Home = (): JSX.Element => {

  const { addProduct, cart} = useCart();
  const [products, setProducts] = useState<ProductFormatted[]>([])

  const AmountItemCart = cart.reduce((amountProductCart, product) =>{
    const newAmountProduct = {...amountProductCart};
    newAmountProduct[product.id] = product.amount;
    return newAmountProduct;

  },{} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('products');
      const data = response.data.map(product =>({
        ...product,
        priceFormatted:formatPrice(product.price)

      }))
      setProducts(data);
    }

    loadProducts();
    
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList >
      {products.map(product =>(
        <li key={product.id}>
          <img src={product.image} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() =>handleAddProduct(product.id)}>
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {AmountItemCart[product.id] || 0 }
              </div>
              <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
