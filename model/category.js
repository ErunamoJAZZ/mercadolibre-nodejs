var Base = require('./base');

exports = module.exports = class Category extends Base {
    constructor(manager, category)
    {
        super(manager, category);

        if (this.children_categories)
        {
            for (var i in this.children_categories)
            {
                this.children_categories[i] = new Category(
                    manager,
                    this.children_categories[i]
                );
            }
        }
    }

    categories()
    {
        return this.manager.get('/categories/' + this.id, Category);
    }
}
