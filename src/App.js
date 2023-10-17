import './App.css';
import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PageBreaker } from './components/PageBreaker';

function App() {
  return (
    <div className="App">
      <PageBreaker header={<Header />} footer={<Footer />}>
        <Content />
      </PageBreaker>
    </div>
  );
}

export default App;
