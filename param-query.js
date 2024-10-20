module.exports = (app, products) => {
    // Home Page Route (Optional: Not needed for API functionality)
    app.get('/', (req, res) => {
        res.send('<h1>Home Page</h1><a href="/api/products">View Products</a>');
    });

    // Fetch all products, including price and description
    app.get('/api/products', (req, res) => {
        res.json(products);  // Send all product properties including price and description
    });

    // Fetch a single product by ID
    app.get('/api/products/:productID', (req, res) => {
        const { productID } = req.params;
        const singleProduct = products.find(product => product.id === Number(productID));
        if (!singleProduct) {
            return res.status(404).send('Product Does Not Exist');
        }
        res.json(singleProduct); // Send full product details
    });

    // Fetch product reviews (For testing purposes)
    app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
        console.log(req.params);
        res.send('Review endpoint');
    });

    // Query products with search and limit functionality
    app.get('/api/v1/query', (req, res) => {
        const { search, limit } = req.query;
        let sortedProducts = [...products];

        if (search) {
            sortedProducts = sortedProducts.filter(product =>
                product.name.toLowerCase().startsWith(search.toLowerCase())
            );
        }
        if (limit) {
            sortedProducts = sortedProducts.slice(0, Number(limit));
        }
        if (sortedProducts.length < 1) {
            return res.status(200).json({ success: true, data: [] });
        }
        res.status(200).json(sortedProducts);
    });
};
