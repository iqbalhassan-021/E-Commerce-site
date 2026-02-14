import React, { createContext, useContext, useState } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [categorizedProducts, setCategorizedProducts] = useState({});
  return (
    <ProductsContext.Provider value={{ categorizedProducts, setCategorizedProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
