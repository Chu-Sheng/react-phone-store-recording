import React from 'react';
import CartItem from './CartItem';

export default function CartList({value}) {
  console.log('CartList.js value: ', value);
  const {cart} = value;
  console.log('CartList.js cart: ', cart);

  return (
    <div className="container-fluid">
      {cart.map(item => {
        return <CartItem key={item.id} item={item} value={value} />
      })}
    </div>
  )
}
