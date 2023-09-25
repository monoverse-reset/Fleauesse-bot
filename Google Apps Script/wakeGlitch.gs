function wakeGlitch() {
    const GLITCH_URL = "https://dawn-chambray-marquis.glitch.me/";
    const options = {
      "method" : "POST",
      "payload" : {
        "type" : "wake"
      },
      "contentType": "application/json; charset=utf-8"

    };
    UrlFetchApp.fetch(GLITCH_URL,options);
}
