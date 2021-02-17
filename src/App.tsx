import "./styles.scss";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from './pages/home';
import { makeStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Toolbar,
  Container,
  Typography
} from "@material-ui/core";

function App() {

  const classes = useStyles();

  return <div className={classes.root}>
    <Router>

      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Tracie Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.body} maxWidth="lg">
        <Switch>
          <Route path="/" component={HomePage} />
        </Switch>
      </Container>
    </Router>
  </div>
}


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  body: {
    marginTop: theme.spacing(4),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default App;
