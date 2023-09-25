class Cache{

  /**
   * 全てのキーを取得。
   * @return {array} 全てのキーの一覧
   */
  static getKeys(){

    return this.require("ALL_KEY_OF_THIS");

  }


  /**
   * キーからデータを取得。
   * @param {string} key キー。省略した場合は全てのデータ。。
   * @return {object} {key1 : value1 , key2 : value2 ...}
   */
  static require(key){

    if(key) return this.parseJSON(CacheService.getScriptCache().get(key));

    const obj = {};
    const all = CacheService.getScriptCache().getAll(this.getKeys());

    for(const key in all){
      obj[key] = this.parseJSON(all[key]);
    }
    return obj;
  }

  /**
   * データを追加。
   * @param {string} key キー。複数ある場合はオブジェクトにする。
   * @param {} value 型はなんでも良い。
   */
  static exports(key,value){

    const ScriptCache = CacheService.getScriptCache();
    Date.prototype.toJSON = function(){

        return Utilities.formatDate(this,"JST","yyyy-MM-dd hh:mm:ss");

    }
    if(typeof key === "string"){

      const keys = this.require("ALL_KEY_OF_THIS") || [];

      ScriptCache.put(key,JSON.stringify(value),21600);

      keys.push(key);

      ScriptCache.put("ALL_KEY_OF_THIS",JSON.stringify(keys),21600);

    }else if(typeof key === "object"){

      const keys = this.require("ALL_KEY_OF_THIS") || [];

      for (let i in key){
        key[i] = JSON.stringify(key[i]);
        keys.push(i);
      }
      
      ScriptCache.put("ALL_KEY_OF_THIS",JSON.stringify(keys),21600)
      ScriptCache.putAll(key,21600);

    }

    return this;

  }

  static remove(key){

    if(typeof key==="string"){

      CacheService.getScriptCache().remove(key);

    }else if(Array.isArray(key)){

      CacheService.getScriptCache().removeAll([...key]);

    }else if(!key){

      CacheService.getScriptCache().removeAll(this.getKeys());

    }

    return this;

  }

  static parseJSON (str){

    try{
      return JSON.parse(str);
    }catch{
      return str;
    }

  }

}

/**
 * 値の保持のために使用。
 * 5時間に一度回すことを推奨します。
 */
function conserveData(){
    const data = Cache.require();
    Cache.exports(data);
}
