import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql
} from "@apollo/client"; // See: https://www.apollographql.com/docs/react/get-started/

// import logo from './logo.svg';
import './App.css';
import Layout from './components/layout';
import LoginPage from './pages/login';
import HomePage from './pages/home';

const client = new ApolloClient({
  uri: 'https://ss.albernirentals.com/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <LoginPage/>
      </Layout>
    </ApolloProvider>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
