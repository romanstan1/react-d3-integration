import React, { Component } from 'react';
import { Link } from 'react-router-dom'

const Nav = () =>
  <nav>
    <span><Link to='/'>Home</Link></span>
    <span><Link to='/Terrain'>Terrain</Link></span>
    <span><Link to='/ThreeDSnake'>3d Snake</Link></span>
  </nav>

export default Nav;
