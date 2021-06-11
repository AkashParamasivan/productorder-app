import React from 'react'
import OrderForm from './OrderForm'
import {useForm} from '../../hooks/useForm';
import { Grid} from '@material-ui/core';
import SearchProducts from './SearchProducts';
import OrderedProducts from './OrderedProducts';

const generateOrderNumber=() => Math.floor(100000+Math.random()*900000).toString();

const getFreshModelObject = () =>({
    orderMasterId:0,
    orderNumber:generateOrderNumber(),
    customerId:0,
    pMethod:'none',
    totalAmount:0,
    deletedOrderItemIds:'',
    orderDetails:[]
})

export default function Order() {
    const{ values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls}=useForm(getFreshModelObject);
  



const removeProducts=(index,id) =>{
    let x={...values};
    x.orderDetails=x.orderDetails.filter((_,i)=>i!=index);
    setValues({...x})
}
  
  
  
        return (
           <Grid container spacing={2}>
               <Grid item xs={12}>
            <OrderForm
             values={values} 
             setValues={setValues}
              errors={errors} 
              setErrors={setErrors}
              handleInputChange={handleInputChange}
              resetFormControls={resetFormControls}/>
              </Grid>
            
            <Grid item xs={6}>
                <SearchProducts
                {...{
                
                values,setValues}}/>
            </Grid>
            <Grid item xs={6}>
                <OrderedProducts
                {...{
                values,setValues}}/>
            </Grid>
           </Grid>

            )
}
