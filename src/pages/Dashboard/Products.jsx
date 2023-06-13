import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Modal,
  Button,
  Card,
  CardMedia,
  TextField,
  TablePagination,
  Box,
  Input,
} from '@mui/material'

import { Edit, Delete } from '@mui/icons-material'

import { styled } from '@mui/system'

const Products = () => {
  const Modales = styled('div')({
    position: 'absolute',
    width: 420,
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
    padding: '16px 32px 24px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    justifyContent: 'center',
  })

  const Iconos = styled('div')({
    cursor: 'pointer',
  })

  const baseUrl = 'https://proweb2-app.herokuapp.com/api/product'

  const [data, setData] = useState([])
  const [modalInsertar, setModalInsertar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)

  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
  })

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5))
    setPage(0)
  }

  const slicedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  const handleSubmitRegister = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = objectFromFormData(formData)

    const imageFile = formData.get('image')
    if (!imageFile) {
      console.log('Falta cargar la imagen')
      return
    }
    const base64 = await convertBase64(imageFile)
    data.image = base64

    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    data.user = userId
    peticionPost(data)
  }

  const handleSubmitEdit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = objectFromFormData(formData)

    const imageFile = formData.get('image')
    if (imageFile) {
      const base64 = await convertBase64(imageFile)
      data.image = base64
    }

    if (imageFile.name == '') {
      delete data.image
    }

    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    data.user = userId
    peticionPut(data)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  function objectFromFormData(formData) {
    const obj = {}
    formData.forEach((value, key) => {
      if (value) {
        obj[key] = value
      }
    })
    return obj
  }

  const requestGet = async () => {
    await axios.get(baseUrl).then((res) => {
      setData(res.data)
    })
  }

  const peticionPost = async (form) => {
    await axios.post(baseUrl, form).then((response) => {
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut = async (form) => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      const searchParams = new URLSearchParams(window.location.search)

      // Retrieve the JWT and User ID from the URL
      const token = searchParams.get('token')

      await axios.put(
        baseUrl + '/' + consolaSeleccionada._id,
        JSON.stringify(form),
        {
          headers,
        }
      )
      requestGet()
      abrirCerrarModalEditar()
    } catch (error) {
      if (error.response) {
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
      console.log(error.config)
    }
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + '/' + consolaSeleccionada._id).then((res) => {
      setData(data.filter((consola) => consola._id !== consolaSeleccionada._id))
      abrirCerrarModalEliminar()
    })
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar)
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar)
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar)
  }

  const seleccionarConsola = (consola, caso) => {
    setConsolaSeleccionada(consola)
    caso === 'Editar' ? abrirCerrarModalEditar() : abrirCerrarModalEliminar()
  }

  useEffect(() => {
    const fetchData = async () => {
      await requestGet()
    }

    fetchData()
  }, [])

  const bodyInsertar = (
    <Box component="form" onSubmit={handleSubmitRegister}>
      <Modales>
        <h3>Agregar Nuevo Producto</h3>

        <TextField
          required
          fullWidth
          margin="dense"
          name="name"
          label="Nombre"
        />

        <TextField
          fullWidth
          required
          margin="dense"
          multiline
          rows={6}
          name="description"
          label="Descripción"
        />

        <TextField
          required
          fullWidth
          type="number"
          margin="dense"
          name="price"
          label="Precio"
        />

        <Input
          required
          type="file"
          margin="dense"
          accept="image/jpeg"
          name="image"
          id="image"
          inputProps={{ 'aria-label': 'Imagen' }}
          fullWidth
        />
        <TextField
          required
          fullWidth
          type="number"
          margin="dense"
          name="stock"
          label="Stock"
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '20px',
          }}>
          <Button color="success" type="submit">
            Insertar
          </Button>
          <Button color="inherit" onClick={() => abrirCerrarModalInsertar()}>
            Cancelar
          </Button>
        </Box>
      </Modales>
    </Box>
  )

  const bodyEditar = (
    <Box component="form" onSubmit={handleSubmitEdit}>
      <Modales>
        <h3>Editar Producto</h3>
        <Card sx={{ maxWidth: 345, maxHeight: 200 }}>
          <CardMedia
            component="img"
            alt="Product Image"
            image={consolaSeleccionada.image}
            sx={{ objectFit: 'cover' }}
          />
        </Card>

        <TextField
          required
          fullWidth
          margin="dense"
          name="name"
          label="Nombre"
          defaultValue={consolaSeleccionada && consolaSeleccionada.name}
        />

        <TextField
          fullWidth
          required
          margin="dense"
          multiline
          rows={4}
          name="description"
          label="Descripción"
          defaultValue={consolaSeleccionada && consolaSeleccionada.description}
        />

        <TextField
          required
          fullWidth
          margin="dense"
          name="price"
          label="Precio"
          defaultValue={consolaSeleccionada && consolaSeleccionada.price}
        />

        <Input
          type="file"
          margin="dense"
          accept="image/jpeg"
          name="image"
          id="image"
          inputProps={{ 'aria-label': 'Imagen' }}
          fullWidth
        />

        <TextField
          required
          fullWidth
          margin="dense"
          name="stock"
          label="Stock"
          defaultValue={consolaSeleccionada && consolaSeleccionada.stock}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '20px',
          }}>
          <Button color="primary" type="submit">
            Actualizar
          </Button>
          <Button color="inherit" onClick={() => abrirCerrarModalEditar()}>
            Cancelar
          </Button>
        </Box>
      </Modales>
    </Box>
  )

  const bodyEliminar = (
    <Box>
      <Modales>
        <p>
          ¿Estás seguro que deseas eliminar este producto:{' '}
          <b>{consolaSeleccionada && consolaSeleccionada.name}</b> ?{' '}
        </p>
        <div align="right">
          <Button color="error" onClick={() => peticionDelete()}>
            Eliminar
          </Button>
          <Button onClick={() => abrirCerrarModalEliminar()}>Cancelar</Button>
        </div>
      </Modales>
    </Box>
  )

  return (
    <div className="Products">
      <br />
      <Button variant="contained" onClick={() => abrirCerrarModalInsertar()}>
        Insertar
      </Button>
      <br />
      <br />
      <TableContainer sx={{ boxShadow: 3, mx: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell
                sx={{
                  width: '175px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordWrap: 'break-word', // Utilizamos 'break-word' en lugar de 'nowrap'
                }}>
                Descripción
              </TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Reseñas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {slicedData.map((consola) => (
              <TableRow key={consola._id}>
                <TableCell>{consola.name}</TableCell>
                <TableCell>{consola.description}</TableCell>

                <TableCell>{consola.price}</TableCell>
                <TableCell>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      alt="Product Image"
                      height="140"
                      image={consola.image}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </TableCell>
                <TableCell>{consola.stock}</TableCell>
                <TableCell>{consola.reviews.length}</TableCell>
                <TableCell>
                  <Iconos>
                    <Edit
                      onClick={() => seleccionarConsola(consola, 'Editar')}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Delete
                      onClick={() => seleccionarConsola(consola, 'Eliminar')}
                    />
                  </Iconos>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  )
}

export default Products
