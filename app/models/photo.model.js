const Photo = function (photo) {
    (this.name = photo.name),
    (this.image = photo.image),
    (this.image2 = photo.image2),
    (this.image3 = photo.image3),
    (this.created_at = photo.created_at),
    (this.updated_at = photo.updated_at);
};

module.exports = Photo;