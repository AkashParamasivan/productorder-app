import { ListItemText ,ListItem,List,Paper,InputBase, IconButton,makeStyles, ListItemSecondaryAction} from '@material-ui/core';
import React,{useState,useEffect} from 'react'
import {createAPIEndpoint,ENDPOINTS} from "../../api";
import SearchIcon from '@material-ui/icons/Search';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles =makeStyles(theme=>({
    searchPaper:{
        padding:'2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    SearchInput:{
        marginLeft:theme.spacing(1.5),
        flex:1,
    },
    listRoot: {
        marginTop: theme.spacing(1),
        maxHeight: 450,
        overflow: 'auto',
        '& li:hover': {
            cursor: 'pointer',
            backgroundColor: '#E3E3E3'
        },
        '& li:hover .MuiButtonBase-root': {
            display: 'block',
            color: '#000',
        },
        '& .MuiButtonBase-root': {
            display: 'none'
        },
        '& .MuiButtonBase-root:hover': {
            backgroundColor: 'transparent'
        }
    }

}))

export default function SearchProducts(props) {

    const{values,setValues} = props;

    const orderedProducts=values.orderDetails;

    const[products,setProducts]=useState([]);
   
    const [searchList,setSearchList]=useState([]);
    const [searchKey,setSearchKey]=useState('');

    const classes=useStyles();

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.PRODUCT).fetchAll()
        .then(res=>{
            setProducts(res.data)
            setSearchList(res.data)
        })
        .catch(err => {console.error(err)})

    },[])

    useEffect(()=>{
        let x=[...products];
        x=x.filter(y=>{
             return y.productName.toLowerCase().includes(searchKey.toLocaleLowerCase())
             //&& orderedProducts.every(item=>item.productId!=y.productId)
        });
        setSearchList(x)
    },[searchKey,orderedProducts])

    const addProducts=products =>{
        let x={
            orderMasterId:values.orderMaster,
            orderDetailId:0,
            productId:products.productId,
            quantity:1,
            productPrice:products.productPrice,
            productName:products.productName
            }
            setValues({
                ...values,
                orderDetails:[...values.orderDetails, x]
            })
    }
    return (
        <>
        <Paper className={classes.searchPaper}>
            <InputBase
            className={classes.SearchInput}
            value={searchKey}
            onChange={e=>setSearchKey(e.target.value)}
            placeholder="Seach Products"/>
            <IconButton>
            <SearchIcon/>
            </IconButton>
        </Paper>
      <List className={classes.listRoot}>
          {
              searchList.map((item,idx)=>(
                  <ListItem
                  key={idx}
                  onClick={e=>addProducts(item)}>
                   <ListItemText
                   primary={item.productName}
                   secondary={'₹'+item.productPrice}
                   />
                  <ListItemSecondaryAction>
                      <IconButton onClick={e=>addProducts(item)}>
                          <PlusOneIcon/>
                          <ArrowForwardIosIcon/>
                      </IconButton>
                  </ListItemSecondaryAction>
                  </ListItem>
              ))
          }
      </List>
      </>
    )
}
