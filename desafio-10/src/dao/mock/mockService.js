class MockService {
    generateMockProducts(count) {
        const mockProducts = [];
        for (let i = 1; i <= count; i++) {
            mockProducts.push({
                id: i,
                title: `Product ${i}`,
                description: `Description for Product ${i}`,
                price: this.getRandomPrice(10, 100),
                thumbnails: [this.getRandomThumbnail()],
                code: `CODE${i}`,
                stock: this.getRandomStock(1, 100)
            });
        }
        return mockProducts;
    }

    getRandomPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomThumbnail() {
        const imageUrls = [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
            'https://example.com/image3.jpg'
        ];
        return imageUrls[Math.floor(Math.random() * imageUrls.length)];
    }

    getRandomStock(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = new MockService();