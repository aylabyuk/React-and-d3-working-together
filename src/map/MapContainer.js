import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { Drawer, IconButton, Hidden } from 'material-ui/';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import { connect } from 'react-redux'
import * as mapActions from './mapActions'

import SearchBox from './SearchBox'
import PhMap from './Map'
import SitesList from './SitesList'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  drawerPaperRight: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    border: 0
  },
  drawerPaperBottom: {
    position: 'relative',
    height: '50vh',
    width: '100%',
    border: 0
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    backgroundColor: '#bdc3c7',
    ...theme.mixins.toolbar,
  },
  drawerInner: {
    width: '100%',
    height: '100%'
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-style': {
    [theme.breakpoints.up('sm')]: {
      marginRight: -drawerWidth-1,
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '-50vh',
      height: `calc(100% - 50vh)`
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-margin': {
    [theme.breakpoints.up('sm')]: {
      marginRight: 0
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
  },
});

class Map extends React.Component {
  
  render() {
    const { classes, setSelectedSite, selectedSite, drawerOpen } = this.props;

    const drawerRight = (
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaperRight,
        }}
        anchor='right'
        open={drawerOpen}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <SearchBox />
            <IconButton onClick={this.props.closeDrawer}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <SitesList />
        </div>
      </Drawer>
    );

    const drawerBottom = (<Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaperBottom,
        }}
        anchor='bottom'
        open={drawerOpen}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <SearchBox />
            <IconButton onClick={this.props.closeDrawer}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <SitesList />
        </div>
      </Drawer>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <main
            className={classNames(classes.content, classes[`content-style`], {
              [classes.contentShift]: drawerOpen,
              [classes[`contentShift-margin`]]: drawerOpen,
            })}
          >
            <PhMap />
          </main>
          <Hidden smDown>{drawerRight}</Hidden>
          <Hidden smUp>{drawerBottom}</Hidden>
        </div>
      </div>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { ...state.map }
}

Map = connect(mapStateToProps, { ...mapActions })(Map)

export default withStyles(styles, { withTheme: true })(Map);