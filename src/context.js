import React, { Component } from 'react'
import { storeProducts, detailProduct } from './data';
const ProductContext = React.createContext();
//Provider
//Consumer

class ProductProvider extends Component {
  state = {
    // products: storeProducts,
    products: [],
    detailProduct: detailProduct,
    cart: [],
    // cart: storeProducts,
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  }
  componentDidMount() {
    this.setProducts();
  }
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem]
    })
    this.setState(() => {
      return { products: tempProducts };
    })
  }
  getItem = (id) => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  }
  handleDetail = (id) => {
    // console.log('hello from detail')
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product }
    })
  };
  addToCart = (id) => {
    // console.log('hello from addToCar id: ', id);
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(() => {
      return { products: tempProducts, cart: [...this.state.cart, product] };
    }, () => {
      // console.log('context.js addToCart this.state: ', this.state);
      this.addTotals();
    });
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true }
    })
  }
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false }
    })
  }
  increment = (id) => {
    // console.log('context.js increment id: ', id);
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count + 1;
    product.total = product.count * product.price;

    this.setState(() => {
      return { cart: [...tempCart] }
    }, () => {
      this.addTotals();
    })
  }
  decrement = (id) => {
    // console.log('context.js decrement id: ', id);
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;

    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState(() => {
        return { cart: [...tempCart] }
      }, () => {
        this.addTotals();
      });
    }
  };
  removeItem = (id) => {
    // console.log('context.js removeItem id: ', id);
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(this.getItem(id));
    let removeProduct = tempProducts[index];
    removeProduct.inCart = false;
    removeProduct.count = 0
    removeProduct.total = 0;

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts]
      }
    }, () => {
      this.addTotals();
    })
  }
  clearCart = () => {
    // console.log('context.js clearCart: ');
    this.setState(() => {
      return { cart: [] };
    }, () => {
      this.setProducts();
      this.addTotals();
    })
  }
  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      };
    });
  };
  render() {
    // console.log('context.js products: ', this.state.products);
    // console.log('context.js detailproduct: ', this.state.detailProduct);
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart
      }}>
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer, ProductContext }
