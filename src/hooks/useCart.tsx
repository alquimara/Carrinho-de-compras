import { createContext, ReactNode, useContext, useState,useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cart from '../pages/Cart';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}





const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
  const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart); 
    }

    return [];
  });
  const prevCardRef = useRef<Product[]>()
  useEffect(() =>{
    prevCardRef.current = cart;
  })
  const cartPreviousValue = prevCardRef.current ?? cart;
  useEffect(() =>{
    if(cartPreviousValue !== cart){
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
      
    }
  },[cart,cartPreviousValue])

  const addProduct = async (productId: number) => {
    
    try {
      const UpdateCart = [...cart];
      const ProductExist = UpdateCart.find(product => product.id === productId);
      const Stock =await api.get(`/stock/${productId}`);
      const StockAmount = Stock.data.amount;
      const currentAmount = ProductExist ? ProductExist.amount:0;
      const amount = currentAmount +1;
     

      if(amount > StockAmount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      if(ProductExist){
        ProductExist.amount = amount;
      }
      else{
        const product = await api.get(`/products/${productId}`);
        const newProduct ={
          ...product.data,
          amount:1
        }
        UpdateCart.push(newProduct);
      }
      setCart(UpdateCart);
    
    
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
    
      const productUpdate = [...cart];
      const productIndex = productUpdate.findIndex( product => product.id === productId);
      if(productIndex >=0){
        productUpdate.splice( productIndex,1)
        setCart(productUpdate);
      

      }
      else{
        throw Error();
      }
      
    } catch {
      toast.error('Erro na remoção do produto');
     
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <=0){
        return;
      }
      const UpdateCart = [...cart];
      const ProductExist = UpdateCart.find(product => product.id === productId);
      const Stock =await api.get(`/stock/${productId}`);
      const StockAmount = Stock.data.amount;

      if(amount > StockAmount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      if(ProductExist){
        ProductExist.amount = amount;
        setCart(UpdateCart)
       

      }
      else{
        throw Error();
      }
  
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
