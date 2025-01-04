import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="logo">
        <img src="./logo-color.svg" alt="Logo" class="logo-img" />
      </div>
      <ul class="nav-links">
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Kits</a></li>
        <li><a href="#">Personal</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color:rgb(208, 228, 235); /* Light Blue */
        padding: 15px 30px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .logo-img {
        height: 40px;
        width: auto;
      }

      .nav-links {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .nav-links li {
        margin-left: 30px;
      }

      .nav-links a {
        text-decoration: none;
        color: rgb(12, 69, 122); /* Black */
        font-size: 1.125rem; /* text-lg */
        font-weight: 700; /* font-bold */
        text-transform: uppercase; /* Uppercase */
        transition: color 0.3s ease;
      }

      .nav-links a:hover {
        color:rgb(255, 255, 255); /* Darker Blue on hover */
      }
    `,
  ],
})
export class NavbarComponent {}
