import {
  Logo,
  Words,
  Header as ArwesHeader,
  Highlight,
  withStyles,
} from 'arwes';
import { Link } from 'react-router-dom';
import Clickable from './Clickable';
import Centered from './Centered';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItem: 'center',
    lineHeight: '80px',
  },
  logo: {
    display: 'inherit',
    marginTop: '15px',
  },
  nav: {
    display: 'inherit',
  },
  banner: {
    display: 'inherit',
    fontWeight: 'bold',
    marginLeft: '10px',
    marginRight: '15px',
    fontSize: 28,
  },
  clickable: {
    fontSize: 21,
    '& i': {
      marginRight: theme.padding / 2,
      fontSize: 24,
    },
  },
  link: {
    color: theme.color.content,
    textDecoration: 'none',
  },
  button: {
    padding: [0, theme.padding / 2],
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
  },
  '@media (max-width: 800px)': {
    logo: {
      display: 'none',
    },
    img: {
      display: 'none',
    },
    banner: {
      display: 'none',
    },
    button: {
      padding: [0, 8],
    },
    clickable: {
      fontSize: 16,
    },
  },
});

const Header = (props) => {
  const { classes, onNav, ...rest } = props;
  return (
    <ArwesHeader animate>
      <Centered className={classes.root} {...rest}>
        <Logo animate size={50} className={classes.logo} layer="header" />
        <Words animate className={classes.banner}>
          NASA Mission Control
        </Words>
        <nav className={`${classes.nav}`}>
          <Clickable className={classes.clickable} onClick={onNav}>
            <Highlight className={classes.button} animate layer="header">
              <Link className={classes.link} to="/launch">
                <div className={classes.linkButton}>
                  <i className="material-icons">check_circle_outline</i>Launch
                </div>
              </Link>
            </Highlight>
          </Clickable>
          <Clickable className={classes.clickable} onClick={onNav}>
            <Highlight className={classes.button} animate layer="header">
              <Link className={classes.link} to="/upcoming">
                <div className={classes.linkButton}>
                  <i className="material-icons">update</i>Upcoming
                </div>
              </Link>
            </Highlight>
          </Clickable>
          <Clickable className={classes.clickable} onClick={onNav}>
            <Highlight className={classes.button} animate layer="header">
              <Link className={classes.link} to="/history">
                <div className={classes.linkButton}>
                  <i className="material-icons">history</i>History
                </div>
              </Link>
            </Highlight>
          </Clickable>
        </nav>
      </Centered>
    </ArwesHeader>
  );
};

export default withStyles(styles)(Header);
