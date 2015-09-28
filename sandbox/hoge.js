'use strict';
require('copy-paste').global();
var nodegit = require('nodegit');
var path = require("path");
var promisify = require("promisify-node");
//var fse = promisify(require("fs-extra"));
var gitrepodir = '/home/sifi/src/testrepo';

//function saveBranch(repo) {
//    return new Promise(function(resolve) {
//        repo.getCurrentBranch().then(function(reforig) {
//            resolve();
//            repo.checkoutBranch(reforig);
//        });
//    });
//}
//
//function saveBranch(repo, callback) {
//    return repo.getCurrentBranch().then(function(reforig) {
//        callback(null);
//        repo.checkoutBranch(reforig);
//    });
//}
//var saveBranch = promisify(saveBranch); 

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
            var filesToAdd = ['test3.yaml'];
            var author = repo.defaultSignature();
            var committer = repo.defaultSignature();
            var message = "test message";
            return repo.createCommitOnHead(filesToAdd, author, committer, message);
        })
        .then(function(commitId) {
            console.log("New Commit: ", commitId);
        })
        .then(function(commitId){
            repo.checkoutBranch(reforig);
        })
        .done(function() {
            console.log('done');
        })
});



nodegit.Repository.open(path.resolve(gitrepodir, '.git'))
.then(function(repo) {
    return repo.getBranchCommit('issues')
        .then( function(commit) {
            console.log(commit);
            return commit;
        }, function(reasonForFailure) {
            console.log("failed to get ref of issues, reason:");
            console.log(reasonForFailure)
            console.log("ok, create a 'issues' branch!");
            return repo.getHeadCommit();
        })
        .then(function(commit) {
            repo.createBranch(
                    "issues",
                    commit,
                    0,
                    repo.defaultSignature(),
                    "Created new-branch on HEAD");
            return commit;
        })
        .then(function(parentcommit){
            return repo.createCommit("HEAD", repo.defaultSignature(), repo.defaultSignature(), "message", oid, [parent]);
        })
        .done(function(){console.log('done!');})
})
