import React, { useEffect, useState } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Skeleton,
} from '@mui/material'
import { createTheme } from '@mui/material/styles'
import axios from 'axios'
import NavBar from './NavBar'
import PageviewIcon from '@mui/icons-material/Pageview'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import granero from "./img/granero.png"


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function Home() {
  const [dataProducts, setDataProducts] = useState([])
  const [dataUser, setDataUser] = useState([])
  const [loading, setLoading] = useState(true) // Estado para indicar si se está cargando la data

  useEffect(() => {
    const fetchData = async () => {
      await requestGetProducts()
      setLoading(false) // Se marca la carga como finalizada
    }

    fetchData()
  }, [])

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

      <main className='Fondo' >
        {/* Hero unit */}
        <NavBar dataUser={dataUser} setData={setDataUser} />
        <Container sx={{ py: 8 }} maxWidth="md" className='Fondo_container'>
          {/* End hero unit */}

          <Grid container spacing={4}>
            {loading // Se verifica si se está cargando la data
              ? // Si se está cargando, se muestra el skeleton
                Array.from(Array(9).keys()).map((index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width={150} />
                        <Skeleton variant="text" width={200} />
                      </CardContent>
                      <CardActions sx={{ paddingLeft: 4 }}>
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={100} />
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              : // Si la data está cargada, se muestran las cards
                dataProducts.map((card) => (
                  <Grid item key={card._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                      {card.image ? (
                        <CardMedia
                          component="div"
                          sx={{
                            // 16:9
                            pt: '56.25%',
                          }}
                          image={card.image}
                        />
                      ) : (
                        <Skeleton variant="rectangular" height={200} />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        {card.name ? (
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.name}
                          </Typography>
                        ) : (
                          <Skeleton variant="text" width={150} />
                        )}
                        {card.description ? (
                          <Typography>{card.description}</Typography>
                        ) : (
                          <Skeleton variant="text" width={200} />
                        )}
                      </CardContent>
                      <CardActions sx={{ paddingLeft: 4 }}>
                        <Button
                          size="small"
                          onClick={() => handleAddToCart(card._id)}>
                          Añadir al carrito
                        </Button>
                        <Button size="small">
                          <PageviewIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box className='Fondo' component="footer">
      <div class="Granero">
        <img src={granero} 
        width="500" 
        height="300" />
        </div>
        <div class="Suelo"></div>

      </Box>

      {/* End footer */}
    </ThemeProvider>
  )
}
