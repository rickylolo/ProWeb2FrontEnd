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
  TextField,
  Box,
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

  const baseUrl = 'http://localhost:3001/api/product'

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setConsolaSeleccionada((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    console.log(consolaSeleccionada)
  }

  const requestGet = async () => {
    await axios.get(baseUrl).then((res) => {
      console.log(res.data)
      setData(res.data)
    })
  }

  const peticionPost = async () => {
    await axios.post(baseUrl, consolaSeleccionada).then((response) => {
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut = async () => {
    await axios
      .put(baseUrl + '/' + consolaSeleccionada._id, consolaSeleccionada)
      .then((response) => {
        var dataNueva = data
        dataNueva.map((consola) => {
          if (consolaSeleccionada._id === consola._id) {
            consola.name = consolaSeleccionada.name
            consola.description = consolaSeleccionada.description
            consola.price = consolaSeleccionada.price
            consola.image = consolaSeleccionada.image
            consola.stock = consolaSeleccionada.stock
          }
        })
        setData(dataNueva)
        abrirCerrarModalEditar()
      })
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
    <Box>
      <Modales>
        <h3>Agregar Nuevo Producto</h3>

        <TextField
          fullWidth
          margin="dense"
          name="name"
          label="Nombre"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          multiline
          rows={6}
          name="description"
          label="Descripción"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          name="price"
          label="Precio"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          name="image"
          label="Imagen"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="stock"
          label="Stock"
          onChange={handleChange}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '20px',
          }}>
          <Button color="success" onClick={() => peticionPost()}>
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
    <Box>
      <Modales>
        <h3>Editar Producto</h3>
        <TextField
          fullWidth
          margin="dense"
          name="name"
          label="Nombre"
          onChange={handleChange}
          value={consolaSeleccionada && consolaSeleccionada.name}
        />

        <TextField
          fullWidth
          margin="dense"
          name="description"
          multiline
          rows={6}
          label="Descripción"
          onChange={handleChange}
          value={consolaSeleccionada && consolaSeleccionada.description}
        />

        <TextField
          fullWidth
          margin="dense"
          name="price"
          label="Precio"
          onChange={handleChange}
          value={consolaSeleccionada && consolaSeleccionada.price}
        />

        <TextField
          fullWidth
          margin="dense"
          name="image"
          label="Imagen"
          onChange={handleChange}
          value={consolaSeleccionada && consolaSeleccionada.image}
        />
        <TextField
          fullWidth
          margin="dense"
          name="stock"
          label="Stock"
          onChange={handleChange}
          value={consolaSeleccionada && consolaSeleccionada.stock}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '20px',
          }}>
          <Button color="primary" onClick={() => peticionPut()}>
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
      <Button onClick={() => abrirCerrarModalInsertar()}>Insertar</Button>
      <br />
      <br />
      <TableContainer sx={{ boxShadow: 3, mx: 'auto', width: '85%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Reseñas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((consola) => (
              <TableRow key={consola._id}>
                <TableCell>{consola.name}</TableCell>
                <TableCell>{consola.description}</TableCell>
                <TableCell>{consola.price}</TableCell>
                <TableCell>{consola.image}</TableCell>
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
