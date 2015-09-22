var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var mkdirp = require("mkdirp");
var execFile = require('child_process').execFile;

module.exports = yeoman.generators.Base.extend({

    prompting: function () {
        var done = this.async();

        this.log(yosay(
            'Welcome to the astonishing ' + chalk.magenta('Express webapp') + ' generator!'
        ));

        var prompts = [{
            name: 'projectName',
            message: 'What would you like to call your project?'
        },
        {
            type: 'confirm',
            name: 'includeReact',
            message: 'Do you want to use React Js?',
        }];

        this.prompt(prompts, function (answers) {
            this.projectName = answers.projectName;
            this.folderName = _.capitalize(_.camelCase(_.deburr(answers.projectName)));
            this.includeReact = answers.includeReact;
            done();
        }.bind(this));
    },

    writing: {

        dir: function() {
            this.log(chalk.magenta("Creating directory for project: " + this.folderName + "..."));
            mkdirp(this.folderName, function (err) {
                if (err) {
                    this.log(chalk.red(err));
                }
                else {
                    this.log(chalk.green("Done!"));
                }
            }.bind(this));
        },

        setDestination: function() {
            this.destinationRoot(this.folderName);
        },

        app: function() {
            this.fs.copyTpl(
                this.templatePath('/*'),
                this.destinationPath(''),
                this
            );
            this.fs.copy(
                this.templatePath('/content/**/*'),
                this.destinationPath('/content/')
            );
            this.fs.copy(
                this.templatePath('/routes/**/*'),
                this.destinationPath('/routes/')
            );
            this.fs.copyTpl(
                this.templatePath('/views/**/*'),
                this.destinationPath('/views/'),
                this
            );
        },

        react: function() {
            this.log(chalk.magenta("Copying react files..."));
            if (this.includeReact) {
                this.fs.copy(
                    this.templatePath('/react/**/*'),
                    this.destinationPath('/content/scripts/')
                );
            }
        },

        projectfiles: function () {
            this.log(chalk.magenta("Copying config files..."));
            this.fs.copy(
                this.templatePath('.jshintrc'),
                this.destinationPath('.jshintrc')
            );
            this.fs.copy(
                this.templatePath('.gitignore'),
                this.destinationPath('.gitignore')
            );
            this.fs.copy(
                this.templatePath('.bowerrc'),
                this.destinationPath('.bowerrc')
            );
        }
    },

    install: function () {
        this.installDependencies();
    }

});