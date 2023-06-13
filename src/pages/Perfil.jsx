import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { styled } from '@mui/system'
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme()

export default function Profile(props) {
  const { dataUser, setDataUser } = props
  const Modales = styled('div')({
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
    padding: '16px 32px 24px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    justifyContent: 'center',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = objectFromFormData(formData)

    const avatarFile = formData.get('avatar')
    if (avatarFile) {
      const base64 = await convertBase64(avatarFile)
      data.avatar = base64
    }
    if (avatarFile.name == '') {
      delete data.avatar
    }
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
      obj[key] = value
    })
    return obj
  }

  const peticionPut = async (form) => {
    try {
      const baseUrl = 'https://proweb2-app.herokuapp.com/api/user'
      const headers = { 'Content-Type': 'application/json' }
      const searchParams = new URLSearchParams(window.location.search)

      const token = searchParams.get('token')
      const userId = searchParams.get('userId')

      await axios.put(baseUrl + '/' + userId, JSON.stringify(form), {
        headers,
      })
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        ...form, // Asignar los nuevos valores del formulario
      }))

      console.log(dataUser)
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

  return (
    <Modales>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          {/* Rest of your code */}
          <Box
            sx={{
              marginTop: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            {/* Avatar and form */}
            <Avatar
              src={dataUser.avatar}
              sx={{ width: 112, height: 112, m: 4 }}
            />

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Input
                    type="file"
                    accept="image/jpeg"
                    name="avatar"
                    id="avatar"
                    inputProps={{ 'aria-label': 'Avatar' }}
                    fullWidth
                  />
                </Grid>

                {/* First name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    fullWidth
                    id="firstName"
                    label="Nombre(s)"
                    autoFocus
                    defaultValue={dataUser.firstName}
                  />
                </Grid>
                {/* Last name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Apellido(s)"
                    name="lastName"
                    autoComplete="family-name"
                    defaultValue={dataUser.lastName}
                  />
                </Grid>
                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    autoComplete="email"
                    defaultValue={dataUser.email}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Actualizar Perfil
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Modales>
  )
}
