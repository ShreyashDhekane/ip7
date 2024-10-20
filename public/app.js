document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const productDetailsDiv = document.getElementById('productDetails');

    let products = []; 

    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            products = await response.json(); 
            displayProducts(products); 
            handleProductIdFromUrl(); 
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = ''; 

        productsToDisplay.forEach(product => {
            const tile = document.createElement('div');
            tile.classList.add('product-tile'); 
            tile.innerHTML = `
                <a href="#" class="product-link" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <p>${product.desc || 'No description available.'}</p>
                </a>
            `;
            productGrid.appendChild(tile);
        });

       
        const productLinks = document.querySelectorAll('.product-link');
        productLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const productId = event.target.closest('a').getAttribute('data-id');

                
                history.pushState({ productId }, '', `?id=${productId}`);

                
                fetchProductById(productId);
            });
        });
    }

    async function fetchProductById(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Product not found'); 
            }
            const product = await response.json();

            
            displayProducts([product]);
        } catch (error) {
            console.error('Error fetching product:', error);
            productDetailsDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
            displayProducts([]); 
        }
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.id.toString().includes(searchTerm)
        );
        displayProducts(filteredProducts); 

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('search', searchTerm);
        history.replaceState(null, '', `?${searchParams.toString()}`);
    });

    const handleProductIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            fetchProductById(id); 
        }
    };

    fetchProducts(); 
});
