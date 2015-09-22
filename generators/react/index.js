var yeoman = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({

    prompting: function() {

        var done = this.async();

        var prompts = [
            {
                name: 'Component',
                message: 'What would you like to call your React-component?',
                required: 'true'
            }
        ];

        this.prompt(prompts, function(answers) {
            this.componentName = _.capitalize(_.camelCase(_.deburr(answers.Component)));
            done();
        }.bind(this));

    },

    writing: function() {
        this.fs.copy(
            this.templatePath('/reactcomponent.jsx'),
            this.destinationPath('/content/scripts/' + this.componentName + '.jsx')
        );
        this.log(chalk.green('Created component ' + this.componentName + '.jsx in folder content/scripts'));
    }

});
