import React, { Component } from 'react';
import {  Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    AppAside,
    AppBreadcrumb,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
  } from '@coreui/react';
// sidebar nav config
import navigation from './nav_config';
// routes config
import routes from '../../../routes';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
class DefaultLayoutAdmin extends Component {
  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">      
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
            <Switch>
              {routes.map((route, idx) => {
                  return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                      <route.component {...props} />
                    )} />)
                    : (null);
                }
              )}
            </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

DefaultLayoutAdmin.propTypes = propTypes;
DefaultLayoutAdmin.defaultProps = defaultProps;

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DefaultLayoutAdmin);
