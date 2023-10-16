import './App.css';
import { Content } from './components/Content';
import { PageBreaker } from './components/PageBreaker';

function App() {
  return (
    <div className="App">
      <PageBreaker>
        <Content />
      </PageBreaker>
    </div>
  );
}

export default App;
