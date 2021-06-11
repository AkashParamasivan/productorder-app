import React,{useState,useEffect} from 'react';
import Form from '../../layouts/Form'
import {ButtonGroup, Grid,Button as MuiButton,makeStyles} from '@material-ui/core';
import Input from '../../controls/Input';
import Select from '../../controls/Select';
import Button from '../../controls/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import ReorderIcon from '@material-ui/icons/Reorder';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {createAPIEndpoint,ENDPOINTS} from '../../api';
import {roundTo2DecimalPoint} from '../../utils/index';
import Popup from '../../layouts/Popup';
import OrderList from '../Order/OrderList'



const pMethods=[
     {id:'none',title:'Select'},
     {id:'Cash',title:'Cash'},
     {id:'Card',title:'Card'}
     
]

const useStyles = makeStyles(theme => ({
   
    submitButtonGroup: {
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))




export default function OrderForm(props) {

   const {values,setValues,errors,setErrors,handleInputChange,resetFormControls}=props;
   const classes = useStyles;
   const [customerList,setCustomerList]=useState([]);

   const [orderListVisibility,setOrderListVisibility]=useState(false);
   const [orderId,setOrderId]=useState(0);

   useEffect(()=>{
       createAPIEndpoint(ENDPOINTS.CUSTOMER).fetchAll()
       .then(res=>{
           let customerList=res.data.map(item=>({
               id:item.customerID,
                title:item.customerName

           }));
           customerList=[{id:0,title:'Select'}].concat(customerList);
           setCustomerList(customerList);
       }

       )
       .catch(err=>console.log(err))
   }, [])


   useEffect(()=>{
      let gTotal=values.orderDetails.reduce((tempTotal,item)=>{
       return tempTotal+(item.quantity*item.productPrice);   
      },0);  

      setValues({
          ...values,totalAmount:roundTo2DecimalPoint(gTotal)
      })
   },[JSON.stringify(values.orderDetails)])

   useEffect(()=>{
       if(orderId==0) resetFormControls()
       else {
           createAPIEndpoint(ENDPOINTS.ORDER).fetchById(orderId)
           .then(res=>{
                  setValues(res.data);
                  setErrors({})
           })
           .catch(err=> console.log(err))
       }
   },[orderId])

   const validateForm=()=>{
       let temp={};
       temp.customerId=values.customerId != 0 ? "" : "This field is required.";
       temp.pMethod=values.pMethod != "none"? "" : "This field is required.";
       temp.orderDetails=values.orderDetails.length !=0? "" : "This field is required.";
       setErrors({...temp});
       return Object.values(temp).every(x=>x==="");
   }

   const submitOrder=e=>{
       e.preventDefault();
       if(validateForm()){
    createAPIEndpoint(ENDPOINTS.ORDER).create(values)
    .then(res=>{
        resetFormControls();
    })
    .catch(err=>console.log(err));
       }
   }
   
   const openListOfOrders=()=>{
       setOrderListVisibility(true);
   }

    return (
        <>
        <Form onSubmit={submitOrder}> 
            <Grid container>
               <Grid item xs={6}>
                   <Input
                    disabled
                     label="Order Number"
                     name="orderNumber"
                     value={values.orderNumber}
                    
                   />
                   <Select
                        label="Customer"
                        name="customerId"
                        value={values.customerId}
                        onChange={handleInputChange}
                        options={customerList}
                        error={errors.customerId}
                   />
                   </Grid> 
               <Grid item xs={6}>
               <Select
                        label="Payment Method"
                        name="pMethod"
                        value={values.pMethod}
                        onChange={handleInputChange}
                        options={pMethods}
                        error={errors.pMethod}
                   />
               <Input
                    disabled
                     label="Grand Total(₹ In Rupees)"
                     name="Total Amount"
                     value={values.totalAmount}
                   />
                   <ButtonGroup className={classes.submitButtonGroup} >
                       <MuiButton size="large" type="submit"
                       endIcon={<ShoppingCartIcon/>}>Submit</MuiButton>
                       <MuiButton size="small" type="submit"
                       startIcon={<ReplayIcon/>}/>
                   </ButtonGroup>
                   <Button
                   size="large"
                   onClick={openListOfOrders}
                   startIcon={<ReorderIcon/>}>Orders</Button>
                   </Grid> 
            </Grid>
        </Form>
        <Popup
        title="List of Orders"
        openPopup={orderListVisibility}
        setOpenPopup={setOrderListVisibility}>
            <OrderList
            {...{setOrderId,setOrderListVisibility,resetFormControls}}/>
        </Popup>
        </>

    )
}
