const Product = function (product) {
    (this.cateid = product.cateid),
    (this.name = product.name),
    (this.alias = product.alias),
    (this.image = product.image),
    (this.price = product.price),
    (this.created_at = product.created_at),
    (this.updated_at = product.updated_at);
};

module.exports = Product;