import React from "react";
import { Link } from "react-router-dom";


export default function HomeView() {
  return (
    <div style={{padding:"50px 20px"}}>
      <h3>Table of content</h3>
      <ul>
        <li><Link to="/gateways">Gateways CRUD</Link></li>
        <li><Link to="/peripheral-devices">Peripheral devices CRUD</Link></li>
      </ul>
    </div>
  );
}
