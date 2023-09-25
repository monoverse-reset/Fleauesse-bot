function doGet(e) {

  const guildId = e.parameter.guild_id;

  return response(Cache.require(guildId))
  
}

function doPost(e){

  let result = "OK";

  try{

    const data = JSON.parse(e.postData.contents);

    const {guildId , message} = data;

    Cache.exports(guildId,message);

  }catch(e){

    result = e;

  }

  return response(result);

}


function response (content) {
  const res = ContentService.createTextOutput()
  // レスポンスの Content-Type ヘッダーに "application/json" を設定する
  res.setMimeType(ContentService.MimeType.JSON)
  // オブジェクトを文字列にしてからレスポンスに詰め込む
  res.setContent(JSON.stringify(content))
  return res
}
