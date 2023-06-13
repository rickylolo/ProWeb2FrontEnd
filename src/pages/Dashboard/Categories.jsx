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
  TablePagination,
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

  const baseUrl = 'https://proweb2-app.herokuapp.com/api/category'

  const [dataCategories, setData] = useState([])
  const [modalInsertar, setModalInsertar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const slicedData = dataCategories.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  )

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

  const handleSubmitUpdate = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = objectFromFormData(formData)
    peticionPut(data)
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
      const baseUrl = 'https://proweb2-app.herokuapp.com/api/category'
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

  const peticionPut = async (form) => {
    try {
      const baseUrl = 'https://proweb2-app.herokuapp.com/api/category'
      const headers = { 'Content-Type': 'application/json' }

      const searchParams = new URLSearchParams(window.location.search)

      // Retrieve the JWT and User ID from the URL
      const token = searchParams.get('token')
      const id = searchParams.get('userId')

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
          multiline
          rows={6}
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
    <Box component="form" onSubmit={handleSubmitUpdate}>
      <Modales>
        <h3>Editar Categoría</h3>
        <TextField
          fullWidth
          margin="dense"
          name="name"
          label="Nombre"
          defaultValue={consolaSeleccionada && consolaSeleccionada.name}
        />

        <TextField
          fullWidth
          multiline
          rows={6}
          margin="dense"
          name="description"
          label="Descripción"
          defaultValue={consolaSeleccionada && consolaSeleccionada.description}
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
              <TableCell>Descripción</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {slicedData.map((consola) => (
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dataCategories.length}
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

export default Categories
