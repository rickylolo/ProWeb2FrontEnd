import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import PageviewIcon from '@mui/icons-material/Pageview'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import NavBar from './NavBar'
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function Home() {
  const [dataProducts, setDataProducts] = useState([])
  const [dataUser, setDataUser] = useState([])

  const requestGet = async () => {
    // Obtener los parámetros de consulta de la URL
    const urlParams = new URLSearchParams(window.location.search)
    // Obtener el valor del token
    const token = urlParams.get('token')
    // Obtener el valor del userId
    const userId = urlParams.get('userId')

    const baseUrl = 'http://localhost:3001/api/user'

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    axios
      .get(baseUrl + '/' + userId, config)
      .then((res) => {
        setDataUser(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  useEffect(() => {
    const fetchData = async () => {
      await requestGet()
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await requestGetProducts()
    }

    fetchData()
  }, [])

  const requestGetProducts = async () => {
    const baseUrl = 'http://localhost:3001/api/product'
    await axios.get(baseUrl).then((res) => {
      setDataProducts(res.data)
    })
  }

  const handleAddToCart = async (idProducto) => {
    const baseUrl = 'http://localhost:3001/api/user/addCart'
    // Obtener la URL actual
    const urlParams = new URLSearchParams(window.location.search)

    // Obtener el valor del parámetro "userId"
    const userId = urlParams.get('userId')

    const requestData = {
      productId: idProducto,
      userId: userId,
    }

    try {
      const response = await axios.post(baseUrl, requestData)
      console.log('Respuesta de la solicitud:', response.data)
      setDataUser((prevData) => {
        return {
          ...prevData,
          cart: {
            ...prevData.cart,
            list: response.data,
          },
        }
      })
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <NavBar dataUser={dataUser} setData={setDataUser} />
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {dataProducts.map((card) => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>{card.description}</Typography>
                  </CardContent>
                  <CardActions sx={{ paddingLeft: 4 }}>
                    <Button
                      size="small"
                      onClick={() => handleAddToCart(card._id)}>
                      Añadir al carrito
                    </Button>
                    <Button size="small">
                      <PageviewIcon></PageviewIcon>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  )
}
