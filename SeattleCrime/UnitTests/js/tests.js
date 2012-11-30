/// <reference path="references/DataRecord.js" />

test("fuzzyDate - 1 second", function () {
    var date = new Date(Date.now() - (1000));
    var record = new DataRecord(date, null, null, null, null, null, null, null);
    equal(record.fuzzyDate, "1 second ago", "fuzzyDate correctly rounds '1 second'");
});

test("fuzzyDate - 2 second2", function () {
    var date = new Date(Date.now() - (1000 * 2));
    var record = new DataRecord(date, null, null, null, null, null, null, null);
    equal(record.fuzzyDate, "2 seconds ago", "fuzzyDate correctly rounds '2 seconds'");
});

test("fuzzyDate - 1 minute", function () {
    var date = new Date(Date.now() - (1000 * 60));
    var record = new DataRecord(date, null, null, null, null, null, null, null);
    equal(record.fuzzyDate, "1 minute ago", "fuzzyDate correctly rounds '1 minute'");
});

test("fuzzyDate - 2 minutes", function () {
    var date = new Date(Date.now() - (1000 * 60 * 2));
    var record = new DataRecord(date, null, null, null, null, null, null, null);
    equal(record.fuzzyDate, "2 minutes ago", "fuzzyDate correctly rounds '2 minutes'");
});

test("fuzzyDate - 1 hour", function () {
    var date = new Date(Date.now() - (1000 * 60 * 60));
    var record = new DataRecord(date, null, null, null, null, null, null, null);
    equal(record.fuzzyDate, "1 hour ago", "fuzzyDate correctly rounds '1 hour'");
});

test("fuzzyDate - 2 hours", function () {
    var date = new Date(Date.now() - (1000 * 60 * 60 * 2));
    var record = new DataRecord(date, null, null, null, null, null, null, null);
    equal(record.fuzzyDate, "2 hours ago", "fuzzyDate correctly rounds '2 hours'");
});

// Sample tests
//test("hello test", function(){
//    ok( 1== "1","Passed");
//});

//test("a basic test", function () {
//    var value = "hello";
//    equal(value, "hello", "Expected: hello");
//});

//var mathLib = {
//    add5: function (a) {
//        return a + 5;
//    }
//}

//test("add 5", function () {
//    var res = mathLib.add5(10);
//    equal(res, 15, "should be 15");
//});

//module("metro");
//asyncTest("test file update", function () {
//    Windows.Storage.KnownFolders.documentsLibrary.createFileAsync("sample.txt",
//        Windows.Storage.CreationCollisionOption.replaceExisting);

//        Windows.Storage.KnownFolders.documentsLibrary.getFileAsync("sample.txt").then(
//        function (sampleFile) {
//            assert.notEqual(sampleFile, null);
//            start();
//        }
//        );
//});

//module("metro");
//asyncTest("test syndication", function () {
//    var client = new Windows.Web.Syndication.SyndicationClient(); 
//    client.bypassCacheOnRetrieve = true; 
 
//    var uri = new Windows.Foundation.Uri("http://blogs.msdn.com/b/mathew_aniyan/rss.aspx");
//    // Although most HTTP servers do not require User-Agent header, others will reject the request or return 
//    // a different response if this header is missing. Use setRequestHeader() to add custom headers. 
//    client.setRequestHeader("User-Agent", "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)"); 
 
//    client.retrieveFeedAsync(uri).done(function (feed) { 
//        assert.equal(feed.title.text, "Mathew Aniyan's Blog");
//        start();
//    }
//    );
//});



