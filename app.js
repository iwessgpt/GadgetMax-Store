document.addEventListener('DOMContentLoaded', () => {
    const config = STORE_CONFIG;

    // Set common header data
    document.getElementById('store-title').textContent = config.storeName;
    document.getElementById('store-desc').textContent = config.storeDescription;

    // Detect which page we are on
    const isProductPage = document.getElementById('page-product') !== null;

    if (isProductPage) {
        // --- PRODUCT DETAILS PAGE LOGIC ---
        // Get product ID from URL query parameters (e.g., ?id=1)
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));
        
        // Find the product in the config array
        const p = config.products.find(item => item.id === productId);

        if (!p) {
            // Product not found
            document.getElementById('product-showcase').style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
            return;
        }

        document.title = `${p.title} - ${config.storeName}`;

        // Set Product Details
        document.getElementById('product-brand').textContent = p.brand;
        document.getElementById('product-title').textContent = p.title;
        document.getElementById('product-price').textContent = p.price;
        document.getElementById('product-desc').textContent = p.description;

        // Set Main Image
        const mainImg = document.getElementById('main-image');
        if (p.images && p.images.length > 0) {
            mainImg.src = p.images[0];
        }

        // Generate Specs
        const specsList = document.getElementById('product-specs');
        if (p.specs) {
            p.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });
        }

        // Generate Thumbnails
        const thumbGallery = document.getElementById('thumbnail-gallery');
        if (p.images && p.images.length > 0) {
            p.images.forEach((imgSrc, index) => {
                const thumb = document.createElement('div');
                thumb.className = `thumb ${index === 0 ? 'active' : ''}`;
                thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
                
                // Click event to swap main image
                thumb.addEventListener('click', () => {
                    mainImg.style.opacity = 0;
                    setTimeout(() => {
                        mainImg.src = imgSrc;
                        mainImg.style.opacity = 1;
                    }, 150);

                    // Update active state
                    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });

                thumbGallery.appendChild(thumb);
            });
        }

        // Build WhatsApp Link
        const message = `Hi! I would like to order the ${p.brand} ${p.title} (${p.price}).`;
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;
        document.getElementById('buy-btn').href = waLink;

    } else {
        // --- INDEX / LISTING PAGE LOGIC ---
        document.title = `${config.storeName} - ${config.storeDescription}`;
        const grid = document.getElementById('product-grid');

        config.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Get first image or fallback
            const imgUrl = (product.images && product.images.length > 0) ? product.images[0] : '';
            
            card.innerHTML = `
                <a href="product.html?id=${product.id}" class="card-link" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                    <img src="${imgUrl}" alt="${product.title}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyMHB4IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
                    <div class="product-info">
                        <span class="brand-tag" style="font-size:0.75rem; color:var(--accent);">${product.brand}</span>
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-footer" style="margin-top:auto; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                            <span class="product-price" style="font-size:1.3rem;">${product.price}</span>
                            <span class="view-btn" style="color:var(--accent); font-weight:600; font-size:0.9rem;">View Details &rarr;</span>
                        </div>
                    </div>
                </a>
            `;
            grid.appendChild(card);
        });
    }
});
