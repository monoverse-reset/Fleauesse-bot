const DISCORD_BOT_TOKEN =  process.env.DISCORD_BOT_TOKEN;
const GAS_URL = process.env.GAS_URL;
const axios = require("axios");

const {Client,Intents} = require("discord.js");
const client = new Client(
    {intents: 
        [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MEMBERS]
    });
client.on("ready" , () => {
    console.log(`Logged in as ${client.user.tag}!`);
})
client.on("guildMemberAdd",async member => {
    const name = member.displayName + "さん";
    const permission = {
        id: member.id,
        allow: ['VIEW_CHANNEL',"SEND_MESSAGES","ATTACH_FILES","EMBED_LINKS","READ_MESSAGE_HISTORY"], 
        type: "member" 
      };
    const guild = member.guild;
  
  const botPermission = {
    id : client.user.id,
    allow: ['VIEW_CHANNEL',"SEND_MESSAGES","ATTACH_FILES","EMBED_LINKS","READ_MESSAGE_HISTORY"], 
    type : "member"

  }

    const everyonePermission = {
      id : guild.roles.everyone,
      deny : ["VIEW_CHANNEL"],
      type : "role"
    }
    const category = await guild.channels.create(name,{type:"GUILD_CATEGORY",
                                                 permissionOverwrites : [permission]
                                            });
    const contact= await (async function(){
        guild.channels.create("聞き専",{type : "GUILD_TEXT",permissionOverwrite: [permission],parent : category.id});
        guild.channels.create("面接会場",{type : "GUILD_VOICE" , permissionOverwrites : [permission] , parent : category.id});
        guild.channels.create("審議室",{type:"GUILD_TEXT",permissionOverwrites : [{id:member.id,deny : ['VIEW_CHANNEL',"SEND_MESSAGES","ATTACH_FILES","EMBED_LINKS","READ_MESSAGE_HISTORY"],type:"member"}],parent: category.id});
        const room = await guild.channels.create("応接室",{
            type:"GUILD_TEXT",
            parent : category.id,
            permissionOverwrites : [permission],
            position : 1
        });
        return room;
    })();
    const message = await getMessage(guild.id);
    contact.send(`ようこそ${member.toString()}さん!\n${message}`);
})

client.on("messageCreate",async message => {
      
    if(message.author.bot) return;

    if(!message.mentions.users.has(client.user.id)) return;
  
    if(!message.member.permissions.has("ADMINISTRATOR")){
      message.reply("権限がありません。サーバーの管理者に相談してください。");
      return;
    }
  
    if(message.content.includes("+++削除+++")){
      

        const category = message.channel.parent;

        const channels = category.children;
      
        
        channels.forEach(channel => {

            channel.delete();
            
        });

        category.delete();


    }else{
    
      const guildId = message.guild.id;

      const res = await registerMessage(guildId,message.content);

    if(res === "OK"){

        message.reply("【以下の文章を登録しました。】\n\n" + message.content.replace("<@1053994334128709673>",""))

    }else{

        message.reply(res);

    }
      
    }
  




})

client.login(DISCORD_BOT_TOKEN);

async function registerMessage(guildId,message){

    const options = {
      "guildId" : guildId,
      "message" : message.replace("<@1053994334128709673>","")
    }
  
    const result = await axios.post(GAS_URL,options);
  
    const res =  result.data;

    return res;
  }

  async function getMessage(guildId){
  const params = {
    "guild_id" : guildId
  }
    const res = await axios.get(GAS_URL,{params:params});
  const data  = res.data;

  return data;

}
