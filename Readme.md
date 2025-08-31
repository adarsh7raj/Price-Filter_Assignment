# 🛒 Product Price Comparison App

A full-stack application that compares product prices from **Amazon** and **Flipkart** in real-time using the Oxylabs API. Get the best deals by comparing prices across multiple platforms instantly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v16+-green.svg)
![React](https://img.shields.io/badge/react-v18+-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Real-time Search**: Search any product across Amazon and Flipkart simultaneously
- **Smart Debouncing**: Optimized search with 500ms debounce to reduce API calls
- **Price Comparison**: Automatically sorts results by lowest price first
- **Responsive Design**: Clean, mobile-friendly interface
- **Data Normalization**: Unified product data format across different sources
- **Live Updates**: See results update as you type
- **Source Attribution**: Clear indication of which platform offers each deal

## 🚀 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Oxylabs account** with API credentials
- Modern web browser

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd product-price-comparison-app
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `Backend` folder:

```env
OXYLABS_USERNAME=your_oxylabs_username
OXYLABS_PASSWORD=your_oxylabs_password
OXYLABS_URL=https://realtime.oxylabs.io/v1/queries
PORT=5000
```

> **Important**: Replace the placeholder values with your actual Oxylabs credentials. You can get these from your [Oxylabs dashboard](https://oxylabs.io/).

## 🚀 Usage

### 1. Start the Backend Server

```bash
cd Backend
npm start
# Backend will run on http://localhost:5000
```
### 1.1. Or you can do this to start the server
```bash
cd Backend
npm install
node src/index.js
# Backend will run on http://localhost:5000
```
### 2. Start the Frontend Development Server

```bash
cd Frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173` to start comparing prices!

## 🔧 How It Works

### Frontend (React)
1. **User Input**: Text input field with 500ms debounce optimization
2. **API Request**: Sends GET request to `/api/search?query=<search-term>`
3. **Results Display**: Renders product cards sorted by price (lowest first)
4. **Real-time Updates**: Updates results as user types

### Backend (Node.js/Express)
1. **Request Handling**: Receives search queries from frontend
2. **Dual API Calls**: Simultaneously queries both platforms:
   - **Amazon**: Uses `amazon_search` source with `parse: true` for JSON response
   - **Flipkart**: Uses `flipkart_search` source, parses HTML with Cheerio
3. **Data Normalization**: Converts all results to unified format:
   ```javascript
   {
     title: string,
     price: number,
     currency: string,
     image: string,
     url: string,
     source: 'Amazon' | 'Flipkart'
   }
   ```
4. **Price Sorting**: Sorts products by numeric price (ascending)
5. **Response**: Returns sorted product array to frontend

### Data Flow

```
User Input → Debounce → API Call → [Amazon + Flipkart] → Data Parsing → Normalization → Sorting → UI Update
```

## 🛠️ API Endpoints

### `GET /api/search`

Search for products across Amazon and Flipkart.

**Parameters:**
- `query` (string, required): Product search term

**Response:**
```json
[
  {
    "title": "Product Name",
    "price": 299.99,
    "currency": "USD",
    "image": "https://example.com/image.jpg",
    "url": "https://amazon.com/product-link",
    "source": "Amazon"
  }
]
```

## 📁 Project Structure

```
product-price-comparison-app/
├── Backend/
│   ├── src/
│   │   ├── index.ts
        ├── index.js          # Main server file
│   │   ├── routes/           # API routes
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── .env                  # Environment variables
├── Frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── styles/           # CSS files
│   │   └── App.jsx           # Main App component
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API requests
- **Cheerio** - Server-side HTML parsing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling and animations

### External Services
- **Oxylabs Realtime API** - Web scraping service

## 🚨 Troubleshooting

### Common Issues

**Backend not starting:**
- Verify Node.js version (v16+)
- Check if port 5000 is available
- Ensure `.env` file exists with correct credentials

**No search results:**
- Verify Oxylabs credentials in `.env`
- Check internet connection
- Ensure backend server is running

**CORS errors:**
- Verify backend is running on port 5000
- Check frontend is making requests to correct backend URL

**Currency mismatch:**
- Note: This app doesn't convert currencies
- Amazon results may be in USD, Flipkart in INR
- Consider adding currency conversion for accurate comparison

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure both frontend and backend servers are running
4. Check your Oxylabs account has sufficient credits

## 🔮 Future Enhancements

- [ ] Currency conversion for accurate price comparison
- [ ] Price history tracking
- [ ] User accounts and wishlist functionality
- [ ] More e-commerce platforms
- [ ] Price drop notifications
- [ ] Advanced filtering options

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Oxylabs](https://oxylabs.io/) for providing the Realtime API
- [React](https://reactjs.org/) team for the amazing frontend library
- [Express.js](https://expressjs.com/) for the robust backend framework
- [Cheerio](https://cheerio.js.org/) for server-side HTML parsing

---

⭐ **Star this repository if you found it helpful!**