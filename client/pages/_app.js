import '../styles/globals.css';

// import {GeistProvider, CssBaseline} from '@geist-ui/react';

const App = ({Component, pageProps}) => (
  // <GeistProvider>
  // <CssBaseline />
  <Component {...pageProps} />
  // </GeistProvider>
);

export default App;
