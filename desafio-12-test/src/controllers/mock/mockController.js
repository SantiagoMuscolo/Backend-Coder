const MockService = require('../../dao/mock/mockService');

class MockController {
    constructor() {
        this.mockService = new MockService();
    }

    getMockProducts(req, res) {
        const count = 100;
        const mockProducts = this.mockService.generateMockProducts(count);
        res.json(mockProducts);
    }
}

module.exports = MockController;
