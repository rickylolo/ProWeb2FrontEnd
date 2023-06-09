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

function Categories() {
  const Modales = styled('div')({
    position: 'absolute',
    width: 400,
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

  const baseUrl = 'http://localhost:3001/api/category'

  const [dataCategories, setData] = useState([])
  const [modalInsertar, setModalInsertar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)

  const initialState = {
    name: '',
    description: '',
  }

  const [consolaSeleccionada, setConsolaSeleccionada] = useState(initialState)

  const handleSubmitRegister = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = objectFromFormData(formData)
    peticionPost(data)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setConsolaSeleccionada((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function objectFromFormData(formData) {
    const obj = {}
    formData.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }

  const requestGet = async () => {
    await axios.get(baseUrl).then((res) => {
      setData(res.data)
    })
  }

  const peticionPost = async (form) => {
    try {
      const baseUrl = 'http://localhost:3001/api/category'
      const headers = { 'Content-Type': 'application/json' }

      await axios.post(baseUrl, JSON.stringify(form), {
        headers,
      })
      requestGet()
      abrirCerrarModalInsertar()
    } catch (error) {
      if (error.response) {
        //setErrorText(error.response.data)
        //setOpen(true)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
      console.log(error.config)
    }
  }

  const peticionPut = async () => {
    await axios
      .put(baseUrl + '/' + consolaSeleccionada._id, consolaSeleccionada)
      .then((res) => {
        var dataNueva = dataCategories
        dataNueva = dataNueva.map((consola) => {
          if (consolaSeleccionada._id === consola._id) {
            consola.name = consolaSeleccionada.name
            consola.description = consolaSeleccionada.description
          }
          return consola
        })
        setData(dataNueva)
        abrirCerrarModalEditar()
      })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + '/' + consolaSeleccionada._id).then((res) => {
      setData(
        dataCategories.filter(
          (consola) => consola._id !== consolaSeleccionada._id
        )
      )
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
        <h3>Agregar Nueva Categoría</h3>

        <TextField
          fullWidth
          required
          margin="dense"
          name="name"
          label="Nombre"
        />

        <TextField
          fullWidth
          required
          margin="dense"
          name="description"
          label="Descripción"
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
    <Box>
      <Modales>
        <h3>Editar Categoría</h3>
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
          label="Descripción"
          onChange={handleChange}
          value={consolaSeleccionada && consolaSeleccionada.description}
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
          ¿Estás seguro que deseas eliminar esta categoría:{' '}
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
    <div className="Categories">
      <br />
      <Button onClick={() => abrirCerrarModalInsertar()}>Insertar</Button>
      <br />
      <br />
      <TableContainer sx={{ boxShadow: 3, mx: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dataCategories.map((consola) => (
              <TableRow key={consola._id}>
                <TableCell>{consola.name}</TableCell>
                <TableCell>{consola.description}</TableCell>
                <TableCell>{consola.products.length}</TableCell>
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

export default Categories