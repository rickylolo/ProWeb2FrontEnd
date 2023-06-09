import * as React from 'react'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import PaymentIcon from '@mui/icons-material/Payment'
const products = [
  {
    name: 'Product 1',
    desc: 'A nice thing',
    price: '$9.99',
  },
  {
    name: 'Product 2',
    desc: 'Another thing',
    price: '$3.45',
  },
  {
    name: 'Product 3',
    desc: 'Something else',
    price: '$6.51',
  },
  {
    name: 'Product 4',
    desc: 'Best thing of all',
    price: '$14.11',
  },
]

export default function Review() {
  return (
    <React.Fragment>
      <Box
        sx={{
          mx: 'auto',
          maxWidth: '420px',
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 2,
          position: 'relative', // Posicionamiento relativo
        }}>
        <Typography variant="h6" gutterBottom>
          Carrito
        </Typography>

        <List>
          {products.map((product) => (
            <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
              <ListItemText primary={product.name} secondary={product.desc} />
              <Typography variant="body2">{product.price}</Typography>
            </ListItem>
          ))}

          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              $34.06
            </Typography>
          </ListItem>
        </List>
      </Box>

      {/* Botón "Realizar pago" */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 1,
          marginBottom: 1,
        }}>
        <Fab variant="extended" color="primary">
          <PaymentIcon sx={{ marginRight: '8px' }} />
          Realizar pago
        </Fab>
      </Box>
    </React.Fragment>
  )
}
