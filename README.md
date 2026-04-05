# MashallahFurniture

A modern, responsive e-commerce website for premium furniture showcasing elegant designs with advanced shopping features.

<img src="https://i.postimg.cc/Tw3786Ly/Screenshot-2026-04-05-193342.png" alt="Screenshot 2" width="800">

## 🌟 Features

### Core Functionality
- **Dynamic Product Catalog**: Browse furniture collections with real-time filtering and search
- **Advanced Shopping Cart**: Add/remove items, quantity management, and persistent storage
- **Wishlist Management**: Save favorite items for later
- **Wallet Integration**: Secure payment simulation with balance management
- **User Account System**: Profile management and order history

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Animations**: Smooth transitions and visual effects
- **Real-time Updates**: Live cart count and dynamic content loading
- **Accessibility**: Screen reader support and keyboard navigation

### Technical Features
- **Component Architecture**: Reusable navbar, footer, and cart components
- **State Management**: Centralized store with event-driven updates
- **Local Storage**: Persistent data across browser sessions
- **Modular JavaScript**: ES6 modules for clean, maintainable code

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables, Flexbox, Grid
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Playfair Display, Inter, Montserrat)
- **Data Storage**: Browser LocalStorage API
- **Build Tools**: None (static site)

## 📁 Project Structure

```
MashallahFurniture/
├── index.html                 # Main entry point
├── assets/
│   └── data/
│       └── products.json      # Product data
├── components/
│   ├── navbar.html           # Navigation component
│   ├── footer.html           # Footer component
│   └── cart-mini.html        # Mini cart overlay
├── css/
│   └── global.css            # Shared styles
├── js/
│   ├── components.js         # Dynamic component loader
│   └── store.js              # State management
├── Home/
│   ├── home.html
│   ├── home.css
│   └── home.js
├── Shop/
│   ├── shop.html
│   ├── shop.css
│   └── shop.js
├── Search/
│   ├── search.html
│   ├── search.css
│   └── search.js
├── Collections/
│   ├── collections.html
│   ├── collections.css
│   └── collections.js
├── About/
│   ├── about.html
│   ├── about.css
│   └── about.js
├── Contact/
│   ├── contact.html
│   ├── contact.css
│   └── contact.js
├── Offers/
│   └── offers.html
├── nav-btn/
│   ├── cart.html
│   ├── favourite.html
│   ├── wallet.html
│   └── Account/
│       └── account.html
└── .vscode/
    └── settings.json
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for fetch API compatibility)

### Installation

1. **Clone or Download** the project:
   ```bash
   # If using git
   git clone <repository-url>
   cd MashallahFurniture
   ```

2. **Start Local Server**:
   - **Using Python** (recommended):
     ```bash
     python -m http.server 8000
     ```
   - **Using Node.js**:
     ```bash
     npx serve
     ```
   - **Using PHP**:
     ```bash
     php -S localhost:8000
     ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000/index.html` or `http://localhost:8000/Home/home.html`

## 📖 Usage

### Navigation
- Use the top navigation bar to browse different sections
- Mobile-friendly hamburger menu for smaller screens
- Cart icon shows live item count

### Shopping
1. Browse products in the Shop section
2. Use filters and search to find specific items
3. Add items to cart or wishlist
4. View cart summary in the slide-out mini cart
5. Proceed to full cart page for checkout

### Account & Wallet
- Create/manage user account
- Add funds to wallet for purchases
- View order history and saved items

## 🎨 Design Philosophy

- **Minimalist Aesthetics**: Clean black and white color scheme
- **Typography**: Elegant serif and sans-serif font combinations
- **Animations**: Subtle micro-interactions for enhanced UX
- **Performance**: Optimized loading with lazy component inclusion

## 🔧 Development

### Component System
The project uses a custom component system for reusability:
- Components are loaded dynamically via `js/components.js`
- Shared elements (navbar, footer) are maintained in one place
- Easy to update site-wide changes

### State Management
- Centralized store in `js/store.js`
- Event-driven updates for reactive UI
- LocalStorage integration for persistence

### Adding New Features
1. Create component in `components/` folder
2. Include via `data-include` attribute
3. Update navigation links as needed
4. Test across all pages

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please contact the development team.

---

*Built with ❤️ for premium furniture shopping experience*</content>
<parameter name="filePath">c:\Users\nyvra\Downloads\MashallahFurniture1\MashallahFurniture\README.md