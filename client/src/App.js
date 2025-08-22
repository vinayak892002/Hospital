import React, { Suspense } from "react";
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// ** Router Import
import Router from "./router/Router";


const App = () => {
  return (
   <div>
     <Suspense fallback={null}>
      <Router />
      
    </Suspense>
   </div>
    
  );
};

export default App;
