import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import granero from './img/granero.png'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {'Copyright © '}

      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme()

export default function SignUp() {
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = objectFromFormData(formData)

    const avatarFile = formData.get('avatar')
    if (!avatarFile) {
      console.log('Falta cargar la imagen')
      return
    }

    const base64 = await convertBase64(avatarFile)
    data.avatar = base64
    data.userType = 2
    console.log(data)
    peticionPost(data)
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

  const peticionPost = async (form) => {
    try {
      const baseUrl = 'https://proweb2-app.herokuapp.com/api/user'
      const headers = { 'Content-Type': 'application/json' }

      await axios.post(baseUrl, JSON.stringify(form), {
        headers,
      })
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
    <section className="Fondo">
      <section className="register-box">
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Regístrate
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Nombre(s)"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Apellido(s)"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Correo electrónico"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Contraseña"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      required
                      type="file"
                      accept="image/jpeg"
                      name="avatar"
                      id="avatar"
                      inputProps={{ 'aria-label': 'Avatar' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Regístrate
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/" variant="body2">
                      ¿Ya tienes una cuenta? Inicia Sesión
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <div>
              <br />
            </div>
          </Container>
        </ThemeProvider>
      </section>

      <br></br>
      <br></br>

      <div class="Granero">
        <img src={granero} width="500" height="300" />
      </div>
      <div class="Suelo"></div>
    </section>
  )
}
