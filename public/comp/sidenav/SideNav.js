import React from 'react';
import { AppBar, Paper, List, ListItem, Divider, Drawer, Avatar  } from 'material-ui'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionDescription from 'material-ui/svg-icons/action/description';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import MapsPlace from 'material-ui/svg-icons/maps/place'
import MapsMap from 'material-ui/svg-icons/maps/map'
import MapsSatellite from 'material-ui/svg-icons/maps/satellite'

import { deepOrange300, blue700 } from 'material-ui/styles/colors';
  

import { withRouter } from 'react-router-dom'

export function sideNav(Component) {

    class SideNav extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                leftDrawer: false
            };
            this.handleOpenSideNav = this.handleOpenSideNav.bind(this);
            this.handleNav = this.handleNav.bind(this);
        }

        handleOpenSideNav() {
            this.setState({leftDrawer: true})
        }

        handleCloseSideNav(cb) {
            this.setState({leftDrawer: false})

            if (typeof cb === "function") {
                cb()
            }
        }

        handleNav(path) {
            this.handleCloseSideNav(() => {
                this.props.history.push(path)
            }) 
        }

        render() {
            let { pathname } =  this.props.location

            return (
                <div>
                    <Component openSideNav={this.handleOpenSideNav}  {...this.props} me={this.props.me} />
                    <Drawer overlayClassName='mybg2' containerStyle={{zIndex: 1500}} overlayStyle={{zIndex: 1400}}  
                        width={280} open={this.state.leftDrawer} docked={false} onRequestChange={()=> this.handleCloseSideNav()}>                    
                        <Paper>
                            <List style={{ paddingTop: '0px' }}>
                                <ListItem className='mybg' leftAvatar={<Avatar color={blue700} backgroundColor={deepOrange300} >OA</Avatar>} 
                                    primaryText={this.props.me.username} secondaryText={this.props.me.email}/>  
                                <Divider/>
                                <ListItem onTouchTap={()=> this.handleNav('/')} primaryText='Dashboard' style={{ color: pathname == '/' ? blue700 : null }} leftIcon={<MapsMap/>} />
                                <ListItem onTouchTap={()=> this.handleNav('/sites')} primaryText='Sites' style={{ color: pathname == '/sites' ? blue700 : null }} leftIcon={<MapsPlace/>} />
                                <ListItem onTouchTap={()=> this.handleNav('/logsheets')} primaryText='Logsheets' style={{ color: pathname == '/logsheets' ? blue700 : null }} leftIcon={<ActionDescription/>} />
                                <ListItem onTouchTap={()=> this.handleNav('/timeseries')} primaryText='Timeseries' style={{ color: pathname == '/timeseries' ? blue700 : null }} leftIcon={<MapsSatellite/>} />
                                <Divider/>
                                <ListItem leftIcon={<ActionExitToApp/>}>Logout</ListItem>
                            </List>
                        </Paper>
                    </Drawer>
                </div>
            );
        }
    }

    return withRouter(SideNav)
}