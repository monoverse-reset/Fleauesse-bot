function wakeGlitch() {
    const GLITCH_URL = "";
    const options = {
      "method" : "POST",
      "payload" : {
        "type" : "wake"
      },
      "contentType": "application/json; charset=utf-8"

    };
    UrlFetchApp.fetch(GLITCH_URL,options);
}
