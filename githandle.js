'use strict';
var nodegit = require('nodegit');
var path = require('path');
var fse = require('fs-extra');
var log4js = require('log4js'); 
var logger = log4js.getLogger('githandle');
logger.setLevel('DEBUG');
require('copy-paste').global();

function createGitIssueBranch(gitrepodir) {
    var reforig;
    var index;
    var oid;
    var head;
    nodegit.Repository.open(path.resolve(gitrepodir, '.git'))
    .then(function(repo) {
        return repo.getCurrentBranch()
            .then(function(reforigResult) {
                reforig = reforigResult;
            })
            .then(function() {
                return repo.getReferenceCommit('issues');
            })
            .then(function(commit) {
                logger.debug(commit);
                return commit;
            }, function(reasonForFailure) {
                logger.debug('failed to get ref of issues, reason:');
                logger.debug(reasonForFailure)
                return repo.getHeadCommit();
            })
            .then(function(commit) {
                logger.debug("ok, create a 'issues' branch!");
                repo.createBranch( 'issues', commit, 0, repo.defaultSignature(),
                        'Created issues branch on HEAD');
                return commit;
            })
            .then(function() {
                logger.debug('and then, checkout issues branch');
                return repo.checkoutBranch('issues');
            })
            .then(function() {
                logger.debug('get index');
                return repo.index();
            })
            .then(function(i) {
                index = i;
                logger.debug('get current branch');
                return repo.getCurrentBranch();
            })
            .then(function(ref) {
                logger.debug('get branch commit');
                return repo.getBranchCommit(ref);
            })
            .then(function(commit) {
                head = commit;
                logger.debug('get commit tree');
                return commit.getTree();
            })
            .then(function(tree) {
                // `walk()` returns an event.
                //var walker = tree.walk();
                //walker.on('entry', function(entry) {
                    //logger.debug(entry.path());
                    //index.removeByPath(entry.path());
                //});
                //walker.start();
                tree.entries().forEach(function(e){
                    logger.debug('remove', path.join(repo.workdir(),e.path()));
                    index.removeByPath(e.path());
                    fse.removeSync(path.join(repo.workdir(),e.path()));
                })
                index.write();
            })
            .then(function(){
                logger.debug('write to tree');
                return index.writeTree();
            })
            .then(function(o) {
                oid = o;
                return nodegit.Reference.nameToId(repo, 'HEAD');
            })
            .then(function() {
                var author = repo.defaultSignature();
                var committer = repo.defaultSignature();
                //return repo.createCommitOnHead(files, author, committer, 'hogehoge');
                logger.debug('commit!!');
                return repo.createCommit('HEAD', author, committer, 'Initialize issues branch', oid, [head])
            })
            .then(function(commitId) {
                logger.debug('New Commit: ', commitId);
            })
            .then(function(){
                logger.debug('checkout the original branch');
                return repo.checkoutBranch(reforig);
            }, function(reasonForFailure){
            })
            .done(function(){logger.debug('done!');})
    })
}

function addFiles(gitrepodir, files, commitmessage) {
    var index;
    var oid;
    var reforig;
    nodegit.Repository.open(path.resolve(gitrepodir, '.git'))
    .then(function(repo) {
        return repo.getCurrentBranch()
            .then(function(reforigResult) {
                reforig = reforigResult;
            })
            .then(function() {
                return repo.checkoutBranch('issues');
            })
            .then(function() {
                var author = repo.defaultSignature();
                var committer = repo.defaultSignature();
                return repo.createCommitOnHead(files, author, committer, commitmessage);
            })
            .then(function(commitId) {
                logger.debug('New Commit: ', commitId);
            })
            .then(function(commitId){
                repo.checkoutBranch(reforig);
            })
            .done(function() {
                logger.debug('done');
            })
    });
}



module.exports = {
    addFiles: addFiles,
    createGitIssueBranch: createGitIssueBranch
}

if (false) {
    createGitIssueBranch('/home/sifi/src/testrepo');
}
