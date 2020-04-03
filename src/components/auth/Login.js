import React, { useContext, useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Icon,
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import CustomLink from '../common/customInputs/CustomLink';
import CustomTextField from '../common/customInputs/CustomTextField';
import Connections from '../../helpers/Connections';
import { UserContext } from '../../contexts/UserContext';
import CustomCheckBox from '../common/customInputs/CustomCheckBox';
import useErrorCheck from '../common/customHooks/errorHook';

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <CustomLink plain target="_blank" href="https://material-ui.com/">
      Your Website
    </CustomLink>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const validations = {
  email: {
    type: 'isEmail',
    text: 'email.notValid',
  },
  password: [{
    type: 'isEmpty',
    text: 'field.required',
  }],
  terms: {
    type: 'isTrue',
    text: 'field.required',
  },
};


export default function Login() {
  const classes = useStyles();

  const { t } = useTranslation();
  const [values, setValues] = useState({
    email: '',
    password: '',
    terms: false,
  });

  const {
    setCustomError,
    isError,
    getActivateError,
  } = useErrorCheck({
    values,
    validations,
  });

  const { loginUser } = useContext(UserContext);

  const login = async () => {
    const err = getActivateError();
    if (!err) {
      const user = await Connections.getFakeLogin(values.email);
      if (!user) {
        setCustomError({ email: 'user.notFound' });
      } else {
        loginUser(user);
        // setError(null);
      }
    }
  };
  const onKeyDown = event => {
    if (event.key === 'Enter') {
      login().then();
    }
  };

  const handleChange = ({ name, value }) => {
    setValues({ ...values, [name]: value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Icon>lock_outlined</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('login')}
        </Typography>
        <form className={classes.form} noValidate>
          <CustomTextField
            name="email"
            label="email.address"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            type="email"
            autoFocus
            fullWidth
            required
            error={isError('email')}
          />
          <CustomTextField
            name="password"
            label="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            type="password"
            fullWidth
            required
            margin="normal"
            error={isError('password')}
          />
          <CustomCheckBox
            label="terms.agree"
            name="terms"
            onChange={handleChange}
            error={isError('terms')}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            {t('login')}
          </Button>
          <Grid container>
            <Grid item xs>
              <CustomLink to="/forgot" variant="body2">
                {t('password.forgot')}
              </CustomLink>
            </Grid>
            <Grid item>
              <CustomLink to="/signup" variant="body2">
                {t('signUp.noAccount')}
              </CustomLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
