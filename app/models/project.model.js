const Project = function (project) {
    (this.des = project.name),
    (this.deadline = project.alias),
    (this.priority = project.image),
    (this.name = project.price),
    (this.image = project.price),
    (this.short_des = project.price),
    (this.created_at = project.created_at),
    (this.updated_at = project.updated_at);
};

module.exports = Project;