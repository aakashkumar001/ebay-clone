"use client";

import CarouselComp from './components/CarouselComp';
import MainLayout from './layouts/MainLayout'
import Product from './components/Product';
import { useEffect, useState } from 'react';
import useIsLoading from './hooks/useIsLoading';

export default function Home() {

    const [products,setProducts] = useState([])

    const getProducts = async () => {
        useIsLoading(true)

        const response = await fetch('/api/products')
        const prods = await response.json()

        setProducts([])
        setProducts(prods)
        useIsLoading(false)
    }

    useEffect(() => {getProducts()},[])
  return (
     <MainLayout>
      <CarouselComp/>

      <div className='max-w=[1200px] mx-auto'>
         <div className='text-2xl font-bold mt-4 mb-6 px-4'>Products</div>
         <div className='grid grid-cols-5 gap-4'>
           {products.map(product => (
             <Product key={product.id} product={product}/>
           ))}
         </div>
      </div>
     </MainLayout>
  )
}
