import { useOperation, useOperationMethod, OpenAPIProvider } from 'react-openapi-client';

import './App.css';

function App() {
  return (
    <OpenAPIProvider definition="http://localhost:3001/swagger.json">
      <Lists />
    </OpenAPIProvider>
  );
}

function Lists() {
const { loading, error, data } = useOperation('getLists');

if (loading || !data) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}

const listItems = data.map(listItem => <li>{listItem.name}</li>)

return (
  <div className="App">
        <ul>{listItems}</ul>
  </div>
);
}

export default App;
