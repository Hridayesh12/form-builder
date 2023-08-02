import logo from './logo.svg';
import './App.css';
import CreateForm from './components/CreateForm';
import ViewForm from './components/ViewForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SideBar from './components/SideBar';
import ViewAllForms from './components/ViewAllForms';
import Response from './components/Response';
function App() {
  return (
    <div className="bg-slate-200">
      <SideBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new_form" element={<CreateForm />} />
          <Route path="/view_form" element={<ViewAllForms />} />
          <Route path="/view_form/:_id" element={<ViewForm />} />
          <Route path="/response" element={<Response />} />
        </Routes>
      </SideBar>
    </div>
  );
}

export default App;
