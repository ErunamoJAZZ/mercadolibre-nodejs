const SizeChartModel = require("../model/size-chart");

class SizeChart extends require("./base") {
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = "/size_charts/{id}";
        return endpoint;
    }

    get endpointItems() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = "/size_charts/{id}/items";
        return endpoint;
    }

    /**
     * Returns the resource model
     *
     * @return {Model\Base}
     */
    get model() {
        return SizeChartModel;
    }

    /**
     * SizeChart Constructor
     *
     * @param {Meli} manager
     */
    constructor(meli, size_chart) {
        super(meli);

        if (size_chart) {
            return this.fetch(size_chart);
        }
    }

    updateItems(id, items) {
        let endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace("{id}/items", id);
        return this.manager.put(endpoint, items, this.model);
    }
}

exports = module.exports = SizeChart;
