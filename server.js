const express = require('express');
const path = require('path');
const { products } = require('./data');
const app = express();

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints
app.get('/api/products', (req, res) => {
    const newProducts = products.map(({ id, name, image, price, desc}) => ({ id, name, image, price, desc }));
    res.json(newProducts);
});

app.get('/api/products/:productID', (req, res) => {
    const { productID } = req.params;
    const singleProduct = products.find(product => product.id === Number(productID));
    if (!singleProduct) {
        return res.status(404).send('Product Does Not Exist');
    }
    return res.json(singleProduct);
});

// Other routes...
app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
    console.log(req.params);
    res.send('hello world');
});

app.get('/api/v1/query', (req, res) => {
    const { search, limit } = req.query;
    let sortedProducts = [...products];

    if (search) {
        sortedProducts = sortedProducts.filter(product => product.name.startsWith(search));
    }
    if (limit) {
        sortedProducts = sortedProducts.slice(0, Number(limit));
    }
    if (sortedProducts.length < 1) {
        return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json(sortedProducts);
});

// Start the server
app.listen(5000, () => {
    console.log('Server is listening on port 5000....');
});


