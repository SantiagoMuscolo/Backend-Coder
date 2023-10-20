const mockService = require('../../dao/mock/mockService');

class MockController {

    getMockProducts(req, res) {
        const count = 100;
        const mockProducts = mockService.generateMockProducts(count);
        res.json(mockProducts);
    }
}

module.exports = new MockController();
