import { List, Paper,ListItem, ListItemText, ListItemSecondaryAction, IconButton, ButtonGroup, Button } from '@material-ui/core'
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import {roundTo2DecimalPoint} from '../../utils/index';

export default function OrderedProducts(props) {

    const {values,setValues} = props;
  
    let orderedProducts=values.orderDetails;

    const removeProducts=(index,id) =>{
        let x={...values};
        x.orderDetails=x.orderDetails.filter((_,i)=>i!=index);
       
        setValues({...x})
    }

    const updateQuantity=(idx,value) => {
        let x={...values};
        let products=x.orderDetails[idx];
        if(products.quantity+value>0){
     
         x.orderDetails[idx].quantity+=value;
         setValues({...x});
        }
    }

    return (
        <List>
        { 
          orderedProducts.map((item,idx)=>(
              <Paper key={idx}>
                  <ListItem>
                    <ListItemText
                    primary={item.productName}
                    primaryTypographyProps={{
                        component:'h1',
                        style:{
                            fontweight:'500',
                            fontSize:'1.2em'
                        }
                    }}
                      secondary={
                          <>
                          <ButtonGroup size="small">
                              <Button
                              onClick={e=>updateQuantity(idx,-1)}>-</Button>
                              <Button disabled>{item.quantity}</Button>
                              <Button
                              onClick={e=>updateQuantity(idx,+1)}>+</Button>
                          </ButtonGroup>
                          <div>
                          <span>
                              {'₹'+roundTo2DecimalPoint(item.quantity*item.productPrice)}
                          </span>
                         </div>
                          </>
                    }
                    />
                    <ListItemSecondaryAction>
                        <IconButton
                        disableRipple
                        onClick={e=>removeProducts(idx,item.orderDetailId)}>
                         <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
              </Paper>
          ))
        }
        </List>
    )
}
