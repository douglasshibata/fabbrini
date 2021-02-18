import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from "../../services/api";
import { useHistory } from 'react-router-dom';
import { login } from '../../services/auth';
import { Alert } from '@material-ui/lab';
import ReactLoading from 'react-loading';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    link: {
        fontSamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '18px',
        lineHeight: '21px',
        color: '#0071BC',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    inputCPF: {
        width: '100%',
        height: '50px',
        left: '819px',
        top: '334px',
        border: '1px solid #C4C4C4',
    },
    loading:{
        position:'absolute'
    }
}));

export default function SignIn() {
    const classes = useStyles();
    const [cpfNumber, setcpfNumber] = useState('');
    const [senha, setSenha] = useState('');
    const [error,setErro] = useState("");
    const [loading, setLoading] = useState(false)

    const history = useHistory();
    localStorage.setItem('cpfNumber', cpfNumber);

    async function handleSubmit(e) {
        e.preventDefault();
        const data = { cpfNumber, senha }
        try {
            setLoading(true)
            const response = await api.post('/sessions', data);
            localStorage.setItem("_idUsuario",response.data.user._id)
            login(response.data.token);
            history.push('/perfil')
        } catch (error) {
            setLoading(false)
            console.log(error.response);
            if (error.response.data.message) {
                setErro(error.response.data.message.error)
            } else if (error.response.data[0].field === 'password') setErro('Senha inválida')
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            {error&&<Alert  severity='warning' >{error}</Alert>}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
            {loading? <ReactLoading className={classes.loading} type={'spin'} color={'#6BC4EC'} height={'20%'} width={'20%'} />:<></>}
                <input
                    type="text"
                    placeholder='CPF*' minLength='11' maxLength='11' required
                    value={cpfNumber}
                    onChange={e => setcpfNumber(e.target.value)}
                    className={classes.inputCPF}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="senha"
                    label="Senha"
                    type="password"
                    id="senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    autoComplete="current-password"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Entrar
          </Button>
                <Grid container>
                    <Grid item xs>
                        <Link to="/cadastrar" variant="body2" className={classes.link}>
                            Cadastrar-se
                        </Link>
                    </Grid>
                    <Grid item xs>
                        <Link to="/forgot-password" variant="body2" className={classes.link}>
                            Esqueci a senha
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}