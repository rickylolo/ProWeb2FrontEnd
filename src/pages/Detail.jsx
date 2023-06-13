import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import PaymentIcon from '@mui/icons-material/Payment'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import axios from 'axios'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import Checkout from './Checkout/Checkout'
export default function Detail({ data, setData }) {
  const [modalCheckout, setModalCheckout] = useState(false)

  const abrirCerrarModalCheckout = () => {
    setModalCheckout(!modalCheckout)
  }

  const calculateTotal = () => {
    if (data) {
      return data?.products.reduce((total, item) => {
        return total + item.quantity * item.product.price
      }, 0)
    } else {
      return 0
    }
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    const baseUrl = 'https://proweb2-app.herokuapp.com/api/list'

    const requestData = {
      product: itemId,
      quantity: newQuantity,
    }

    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    axios
      .put(baseUrl + '/' + data._id, JSON.stringify(requestData), requestConfig)
      .then((res) => {
        // Actualizar los datos en el estado
        const updatedData = { ...data }
        const productIndex = updatedData.products.findIndex(
          (item) => item.product._id === itemId
        )

        if (productIndex !== -1) {
          updatedData.products[productIndex].quantity = newQuantity
          setData((prevData) => {
            return {
              ...prevData,
              cart: {
                ...prevData.cart,
                list: updatedData,
              },
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error al actualizar la cantidad:', error)
      })
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          mx: 'auto',
          maxWidth: '620px',
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 2,
          position: 'relative',
        }}>
        <Typography variant="h6" gutterBottom>
          Carrito
        </Typography>

        <List>
          {data?.products.map((item) => (
            <ListItem key={item.product._id} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{
                  maxWidth: '300px',
                }}
                primary={item.product.name}
                secondary={item.product.description}
              />
              <Grid container alignItems="center">
                <IconButton
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2">
                  Cantidad: {item.quantity}
                </Typography>
                <IconButton
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }>
                  <AddIcon />
                </IconButton>
              </Grid>
              <Typography variant="body2">
                ${item.quantity * item.product.price}
              </Typography>
            </ListItem>
          ))}
          <Divider />
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${calculateTotal()}
            </Typography>
          </ListItem>
          <Divider />
        </List>

        <Modal open={modalCheckout} onClose={abrirCerrarModalCheckout}>
          <Checkout />
        </Modal>
      </Box>

      {/* Botón "Realizar pago" */}

      {data && data.products.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 1,
            marginBottom: 1,
          }}>
          <Fab
            variant="extended"
            color="primary"
            onClick={abrirCerrarModalCheckout}
            sx={{
              fontSize: 12, // Ajusta el tamaño de la fuente
              padding: 3, // Ajusta el espacio alrededor del contenido
            }}>
            <PaymentIcon sx={{ marginRight: '4px' }} />
            Realizar pago
          </Fab>
        </Box>
      ) : (
        <Typography variant="body1" align="center">
          No hay elementos agregados en tu carrito.
        </Typography>
      )}
    </React.Fragment>
  )
}
