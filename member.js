function skillsMember() {
    return {
        skills: ['JavaScript', 'React', 'Node', 'Angular'],
        addSkill: function(skill) {
            this.skills.push(skill);
        }
    };
}