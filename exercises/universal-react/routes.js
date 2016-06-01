var AppComponent = require('./components/app');
var IndexComponent = require('./components/index');
var AboutComponent = require('./components/about');

exports.routes = {
  path: '',
  component: AppComponent,
  childRoutes: [
    {
      path: '/',
      component: IndexComponent
    },
    {
      path: '/about',
      component: AboutComponent
    }
  ]
};
