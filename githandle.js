'use strict';
var nodegit = require('nodegit');
var path = require('path');
var fse = require('fs-extra');
var log4js = require('log4js'); 
var logger = log4js.getLogger('githandle');
logger.setLevel('DEBUG');
require('copy-paste').global();

function GitHandle(options) {
  var self = this;
  options = options || {};
  if (!options.hasOwnProperty('repoDirectory') || options.repoDirectory === '') {
    logger.warn('No repoDirectory is set. abort.');
    return self;
  }
  var repo = nodegit.Repository.open(path.resolve(options.repoDirectory, '.git'));
  var ISSUE_BRANCH_NAME = 'issues';

  self.createBranchAndInit = function() {
    var reforig;
    var index;
    var oid;
    var head;

    return repo.getCurrentBranch()
      .then(function(reforigResult) {
        reforig = reforigResult;
      })
      .then(function() {
        return repo.getReferenceCommit(ISSUE_BRANCH_NAME);
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
        repo.createBranch(ISSUE_BRANCH_NAME, commit, 0, repo.defaultSignature(),
            'Created issues branch on HEAD');
        return commit;
      })
      .then(function() {
        logger.debug('and then, checkout issues branch');
        return repo.checkoutBranch(ISSUE_BRANCH_NAME);
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
        logger.debug('commit!!');
        return repo.createCommit('HEAD', author, committer, 'Initialize issues branch', oid, [head])
          //return repo.createCommitOnHead(files, author, committer, 'hogehoge');
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
  }

  self.addFilesAndCommit = function(files, commitMessage) {
    var index;
    var oid;
    var reforig;
    return repo.getCurrentBranch()
      .then(function(reforigResult) {
        reforig = reforigResult;
      })
      .then(function() {
        return repo.checkoutBranch(ISSUE_BRANCH_NAME);
      })
      .then(function() {
        var author = repo.defaultSignature();
        var committer = repo.defaultSignature();
        return repo.createCommitOnHead(files, author, committer, commitMessage);
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
  }
}

module.exports = GitHandle;

if (false) {
  createGitIssueBranch('/home/sifi/src/testrepo');
}
