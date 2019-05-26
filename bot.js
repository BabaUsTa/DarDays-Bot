const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const db = require('quick.db');
const snekfect = require('snekfect.js');
const moment = require('moment');

let linkEngel = JSON.parse(fs.readFileSync("././jsonlar/linkEngelle.json", "utf8"));
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
//sa-as

client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'sA') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });
client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'sa') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });
client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'Sa') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });

client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'selam') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });

client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'SELAM') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });
client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'Selam') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });

client.on('message', async msg => {
  if (msg.content.toLowerCase() === 'sElAmUn AlEyKüM') {
    await msg.react('🇦');
    msg.react('🇸');
  }
  });


//sa as son
//sayaç
client.on("message", async message => {
    let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
    if(sayac[message.guild.id]) {
        if(sayac[message.guild.id].sayi <= message.guild.members.size) {
            const embed = new Discord.RichEmbed()
                .setDescription(`Tebrikler, başarılı bir şekilde ${sayac[message.guild.id].sayi} kullanıcıya ulaştık!`)
                .setColor("0x808080")
                .setTimestamp()
            message.channel.send({embed})
            delete sayac[message.guild.id].sayi;
            delete sayac[message.guild.id];
            fs.writeFile("./ayarlar/sayac.json", JSON.stringify(sayac), (err) => {
                console.log(err)
            })
        }
    }
})
client.on("guildMemberRemove", async member => {
        let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('')
    .setDescription(``)
 .setColor("RED")
    .setFooter("", client.user.avatarURL);
 
  if (!giriscikis[member.guild.id].kanal) {
    return;
  }
 
  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:loudspeaker: ${member.user.tag}, aramızdan ayrıldı, \**${sayac[member.guild.id].sayi}\** kişi olmamıza \**${sayac[member.guild.id].sayi - member.guild.memberCount}\** kişi kaldı!`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }
 
});
client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));  
  let embed = new Discord.RichEmbed()
    .setTitle('')
    .setDescription(``)
 .setColor("GREEN")
    .setFooter("", client.user.avatarURL);
 
  if (!giriscikis[member.guild.id].kanal) {
    return;
  }
 
  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:loudspeaker: ${member.user.tag}, aramıza katıldı **${sayac[member.guild.id].sayi}** kişi olmamıza **${sayac[member.guild.id].sayi - member.guild.memberCount}** kişi kaldı!` );
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }
 
});
   //sayaç
   //otorol
client.on("guildMemberAdd", async member => {
        let sayac = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let otorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let arole = otorole[member.guild.id].sayi
  let giriscikis = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle('Otorol Sistemi')
    .setDescription(`:loudspeaker: :inbox_tray:  @${member.user.tag}'a Otorol Verildi `)
.setColor("GREEN")
    .setFooter("Harmony ", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:loudspeaker: :white_check_mark: Hoşgeldin **${member.user.tag}** Rolün Başarıyla Verildi.`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }

});

client.on("guildMemberAdd", async (member) => {
      let autorole =  JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
      let role = autorole[member.guild.id].sayi

      member.addRole(role)
});
     //otorol
//mod-log
client.on('guildBanAdd', async (guild, member) => {
    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
   const embed = new Discord.RichEmbed()
			.setTitle('Üye yasaklandı.')
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setColor('RANDOM')
			.setDescription(`<@!${member.user.id}>, ${member.user.tag}`)
			.setThumbnail(member.user.avatarURL)
			.setFooter(`Botismi Mod-Log Sistemi | ID: ${member.user.id}`)
			.setTimestamp();
			hgK.send({embed});

		
	})
	
	.on('guildBanRemove', async (guild, member) => {
		    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
			var embed = new Discord.RichEmbed()
			.setTitle('Üyenin yasaklaması kaldırıldı.')
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setColor('RANDOM')
			.setDescription(`<@!${member.user.id}>, ${member.user.tag}`)
			.setThumbnail(member.user.avatarURL)
			.setFooter(`Botismi Mod-Log Sistemi | ID: ${member.user.id}`)
			.setTimestamp();
			hgK.send({embed});
		
	})


	.on('messageDelete', async msg => {
		if (!msg.guild) return;
    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = msg.guild.channels.get(gc[msg.guild.id].gkanal)
    if (!hgK) return;
			var embed = new Discord.RichEmbed()
			.setAuthor(msg.author.tag, msg.author.avatarURL)
			.setColor('RANDOM')
			.setDescription(`<@!${msg.author.id}> tarafından <#${msg.channel.id}> kanalına gönderilen "${msg.content}" mesajı silindi.`)
		.setFooter(`Botismi Mod-Log Sistemi | ID: ${msg.id}`)
			hgK.send({embed});
		
	})

	.on('channelCreate', async channel => {
		if (!channel.guild) return;
    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal)
    if (!hgK) return;		
			if (channel.type === "text") {
				var embed = new Discord.RichEmbed()
				.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`<#${channel.id}> kanalı oluşturuldu. _(metin kanalı)_`)
				.setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			};
			if (channel.type === "voice") {
				var embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı oluşturuldu. _(sesli kanal)_`)
			.setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			}
		
	})
		
	.on('channelDelete', async channel => {
		    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal)
    if (!hgK) return;
			if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı silindi. _(metin kanalı)_`)
				.setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor('RANDOM')
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı silindi. _(sesli kanal)_`)
			.setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`)
				hgK.send({embed});
			}
		
	})

.on('roleDelete', async role => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = role.guild.channels.get(gc[role.guild.id].gkanal)
    if (!hgK) return;
  let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Rol Silindi!`)
        .setThumbnail(role.guild.iconURL)
        .setDescription(`'${role.name}' adlı rol silindi.`, true)
  .setFooter(`Botismi Mod-Log Sistemi | ID: ${role.id}`)
    hgK.send({embed})
})

.on('emojiCreate', async emoji => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = emoji.guild.channels.get(gc[emoji.guild.id].gkanal)
    if (!hgK) return;
  let embedds9 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Emoji Oluşturuldu!`)
        .setThumbnail(emoji.guild.iconURL)
        .setDescription(`<:${emoji.name}:${emoji.id}> - ${emoji.name} adlı emoji oluşturuldu!`, true)
  .setFooter(`Botismi Mod-Log Sistemi | ID: ${emoji.id}`)
    hgK.send({embedds9})
})

.on('emojiDelete', async emoji => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = emoji.guild.channels.get(gc[emoji.guild.id].gkanal)
    if (!hgK) return;
  let embedds0 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Emoji Silindi!`)
        .setThumbnail(emoji.guild.iconURL)
        .setDescription(`':${emoji.name}:' adlı emoji silindi!`, true)
  	.setFooter(`Botismi Mod-Log Sistemi | ID: ${emoji.id}`)
   hgK.send(embedds0)
})

.on('roleCreate', async role => {
  const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
  
  const hgK = role.guild.channels.get(gc[role.guild.id].gkanal)
    if (!hgK) return;
  let embedds0 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Rol Oluşturuldu!`)
        .setThumbnail(role.guild.iconURL)
        .setDescription(`'${role.name}' adlı rol oluşturuldu.`, true)
  .setFooter(`Botismi Mod-Log Sistemi | ID: ${role.id}`)
   hgK.send(embedds0)
})

.on('messageUpdate', async (oldMessage, newMessage) => {
   const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8"));
   const hgK = oldMessage.guild.channels.get(gc[oldMessage.guild.id].gkanal)
    if (!hgK) return;
      if (oldMessage.author.bot) {
        return false;
    }

    if (!oldMessage.guild) {
        return false;
    }

    if (oldMessage.content == newMessage.content) {
        return false;
    }

    if (!oldMessage || !oldMessage.id || !oldMessage.content || !oldMessage.guild) return;
  let embedds4 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Mesaj Güncellendi!`)
        .setThumbnail(oldMessage.author.avatarURL)
        .addField("Gönderen", oldMessage.author.tag, true)
        .addField("Önceki Mesaj", oldMessage.content, true)
        .addField("Şimdiki Mesaj", newMessage.content, true)
        .addField("Kanal", newMessage.channel.name, true)
  	.setFooter(`Botismi Mod-Log Sistemi | ID: ${oldMessage.id}`)
    hgK.send(embedds4)
})
//modlog
//rol verme
client.on('message', msg => {
  if (msg.content.toLowerCase() === 'js') {  // İstediğiniz Komut
       msg.member.addRole("rol idi") //Rolü bir yerde bahsedin sonra sağ tıklayıp İD'sini alın
    msg.reply('Js Rolünü Başarıyla Aldın.'); //Komutu Yazınca cevap ne yazsın?
  }
});
 //rolverme
//link
client.on("message", msg => { 
if (!linkEngel[msg.guild.id]) return;
if (linkEngel[msg.guild.id].linkEngel === "kapali") return;
    if (linkEngel[msg.guild.id].linkEngel === "acik") {
    var regex = new RegExp(/(discord.gg|http|.gg|.com|.net|.org|invite|İnstagram|Facebook|watch|Youtube|youtube|facebook|instagram)/)
    if (regex.test(msg.content)== true) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.delete()
       msg.channel.send(`<@${msg.author.id}>`).then(message => message.delete(5000));
        var e = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor("Link Engeli!")
        .setDescription(`Bu sunucuda linkler **${client.user.username}** tarafından engellenmektedir! Link atmana izin vermeyeceğim!`)
        msg.channel.send(e).then(message => message.delete(5000));
    }
}
    }
});
 //link
client.on('message', msg => {
  if (msg.content === 'd!sponsor') {
    msg.reply('Sponsorumuz:https://discord.gg/h5VajJx ');
  }
});
//sunucu kur
client.on('message', async message => {
  const ms = require('ms');
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucu-kur") {
  if (message.guild.channels.find(channel => channel.name === "Bot Kullanımı")) return message.channel.send(" Bot Paneli Zaten Ayarlanmış.")
  message.channel.send(`Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`)
      if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir.");
      message.channel.awaitMessages(response => response.content === 'evet', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
    .then((collected) => {
   message.guild.createChannel('|▬▬|ÖNEMLİ KANALLAR|▬▬|', 'category', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])



        
 message.guild.createChannel('「📃」kurallar', 'text', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
 message.guild.createChannel('「🚪」gelen-giden', 'text', [{
  id: message.guild.id,
  deny: ['SEND_MESSAGES']
}])
.then(channel =>
       channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
       message.guild.createChannel('「✅」sayaç', 'text', [{
        id: message.guild.id,
        deny: ['SEND_MESSAGES']
      }])
.then(channel =>
             channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
             message.guild.createChannel('「💾」log-kanalı', 'text', [{
              id: message.guild.id,
              deny: ['SEND_MESSAGES']
            }])
            .then(channel => channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
            message.guild.createChannel('「📢」duyuru-odası', 'text', [{
              id: message.guild.id,
              deny: ['SEND_MESSAGES']
            }])
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));

       }) 
       .then((collected) => {
        message.guild.createChannel('|▬▬|GENEL KANALLAR|▬▬|', 'category', [{
       id: message.guild.id,
     }]);
             
      message.guild.createChannel(`「💡」şikayet-ve-öneri`, 'text')
     .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.createChannel(`「👥」pre-arama-odası`, 'text')
     .then(channel =>
            channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.createChannel(`「📷」görsel-içerik`, 'text')
     .then(channel =>
                  channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.createChannel(`「🤖」bot-komutları`, 'text')
     .then(channel =>
                  channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.createChannel(`「💬」sohbet`, 'text')
     .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));

      message.guild.createChannel(`🏆》Kurucu Odası`, "voice")
      .then(channel =>
        channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|SES KANALLARI|▬▬|")))
      .then(c => {
        let role = message.guild.roles.find("name", "@everyone");
        let role2 = message.guild.roles.find("name", "Kurucu");
        
        c.overwritePermissions(role, {
            CONNECT: false,
        });
        c.overwritePermissions(role2, {
            CONNECT: true,
            
        });
    })

    message.guild.createChannel('|▬▬|SES KANALLARI|▬▬|', 'category', [{
      id: message.guild.id,
    }]);

    message.guild.createChannel(`🏆》Yönetici Odası`, "voice")
    .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|SES KANALLARI|▬▬|")))
    .then(c => {
      let role = message.guild.roles.find("name", "@everyone");
      let role2 = message.guild.roles.find("name", "Kurucu");
      let role3 = message.guild.roles.find("name", "Yönetici");
      c.overwritePermissions(role, {
          CONNECT: false,
      });
      c.overwritePermissions(role2, {
          CONNECT: true,
      });
      c.overwritePermissions(role3, {
          CONNECT: true,
      });
  })

  message.guild.createChannel(`💬》Sohbet Odası`, "voice")
  .then(channel =>
    channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|SES KANALLARI|▬▬|")))
  .then(c => {
    let role = message.guild.roles.find("name", "@everyone");
    c.overwritePermissions(role, {
        CONNECT: true,
    });
})

message.guild.createChannel('|▬▬|OYUN ODALARI|▬▬|', 'category', [{
  id: message.guild.id,
}]);

message.guild.createChannel(`🎮》LOL`, 'voice')
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
 message.guild.createChannel(`🎮》ZULA`, 'voice')
 .then(channel =>
  channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
 message.guild.createChannel(`🎮》COUNTER STRİKE`, 'voice')
.then(channel =>
 channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
 message.guild.createChannel(`🎮》PUBG`, 'voice')
 .then(channel =>
  channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
  message.guild.createChannel(`🎮》FORTNİTE`, 'voice')
  .then(channel =>
   channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
   message.guild.createChannel(`🎮》MİNECRAFT`, 'voice')
   .then(channel =>
    channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
    message.guild.createChannel(`🎮》ROBLOX`, 'voice')
    .then(channel =>
     channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
     message.guild.createChannel(`🎮》WOLFTEAM`, 'voice')
     .then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))



      message.guild.createRole({
        name: 'Kurucu',
        color: 'RED',
        permissions: [
            "ADMINISTRATOR",
    ]
      })

      
      message.guild.createRole({
        name: 'Yönetici',
        color: 'BLUE',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
    ]
      })

      message.guild.createRole({
        name: 'Moderatör',
        color: 'GREEN',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
    ]
      })

      message.guild.createRole({
        name: 'V.I.P',
        color: '00ffff',
      })

      message.guild.createRole({
        name: 'Üye',
        color: 'WHITE',
      })

      message.guild.createRole({
        name: 'Bot',
        color: 'ORANGE',
      })

       message.channel.send("Gerekli Odalar Kuruldu!")
     
            })   
    
}
});
//sunucu logsc
client.on('guildDelete', guild => {

let rrrsembed = new Discord.RichEmbed()

.setColor("RED")
.setTitle(" Bot Kickledi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)

   client.channels.get('575757092909219840').send(rrrsembed);
  
});


client.on('guildCreate', guild => {

let rrrsembed = new Discord.RichEmbed()

.setColor("GREEN")
.setTitle(" Bot Eklendi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)

   client.channels.get('575757092909219840').send(rrrsembed);
  
});
//son
//==========================================================================================================================
//   M Ü Z İ K - B A Ş L A N G I Ç                M Ü Z İ K - B A Ş L A N G I Ç           M Ü Z İ K - B A Ş L A N G IC
//=========================================================================================================================l
const { GOOGLE_API_KEY } = require('./anahtarlar.json');
const YouTube = require('simple-youtube-api');
const queue = new Map();  
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

client.on('message', async msg => {

	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

	if (command === 'çal') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
    .setDescription(':warning: | İlk olarak sesli bir kanala giriş yapmanız gerek.'));
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(':warning: | İlk olarak sesli bir kanala giriş yapmanız gerek.'));
		}
		if (!permissions.has('SPEAK')) {
			 return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle(':warning: | Şarkı başlatılamıyor. Lütfen mikrofonumu açınız.'));
        }

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			 return msg.channel.sendEmbed(new Discord.RichEmbed)
      .setTitle(`**DarkDayS | Oynatma Listesi: **${playlist.title}** Kuyruğa Eklendi!**`)
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
          
				 msg.channel.sendEmbed(new Discord.RichEmbed()                  
         .setTitle('DarkDayS | Şarkı Seçimi')
         .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
         .setFooter('Lütfen 1-10 arasında bir rakam seçiniz 10 saniye içinde liste iptal edilecektir.')
         .setColor('0x36393E'));
          msg.delete(5000)
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						 return msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('0x36393E')
            .setDescription(':warning: | **Şarkı Değeri Belirtmediğiniz İçin Seçim İptal Edilmiştir**.'));
                    }
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.sendEmbed(new Discord.RichEmbed()
          .setColor('0x36393E')
          .setDescription(':( | **Aradaım Fakat Hiç Bir Sonuç Çıkmadı**'));
                }
            }
			return handleVideo(video, msg, voiceChannel);
      
		}
	} else if (command === 'geç') {
		if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription('<a:frograinbow:488978511474982933> | **Lütfen öncelikle sesli bir kanala katılınız**.'));
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
     .setColor('RANDOM')
     .setTitle('<a:frograinbow:488978511474982933> | **Hiç Bir Müzik Çalmamakta**'));                                              
		serverQueue.connection.dispatcher.end('**Müziği Geçtim!**');
		return undefined;
	} else if (command === 'durdur') {
		if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription('**:warning: | Lütfen öncelikle sesli bir kanala katılınız.**'));
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
     .setColor('RANDOM')
     .setTitle(':warning: **| Hiç Bir Müzik Çalmamakta**'));                                              
		msg.channel.send(`:stop_button: **${serverQueue.songs[0].title}** Adlı Müzik Durduruldu`);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('**Müzik Bitti**');
		return undefined;
	} else if (command === 'ses') {
		if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(':warning: **| Lütfen öncelikle sesli bir kanala katılınız.**'));
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
     .setColor('RANDOM')
     .setTitle(':warning:| **Hiç Bir Müzik Çalmamakta**'));                                              
		if (!args[1]) return msg.channel.sendEmbed(new Discord.RichEmbed()
   .setTitle(`:warning: Şuanki Ses Seviyesi: **${serverQueue.volume}**`)
    .setColor('RANDOM'))
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setTitle(`:hammer:  Ses Seviyesi Ayarlanıyor: **${args[1]}**`)
    .setColor('RANDOM'));                             
	} else if (command === 'çalan') {
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setTitle(":warning: | **Çalan Müzik Bulunmamakta**")
    .setColor('RANDOM'));
		return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle("DarkDayS| Çalan")                            
    .addField('Başlık', `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`, true)
    .addField("Süre", `${serverQueue.songs[0].durationm}:${serverQueue.songs[0].durations}`, true))
	} else if (command === 'sıra') {
    let index = 0;
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setTitle(":warning: | **Sırada Müzik Bulunmamakta**")
    .setColor('RANDOM'));
		  return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
     .setTitle('DarkDayS | Şarkı Kuyruğu')
    .setDescription(`${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}`))
    .addField('Şu anda çalınan: ' + `${serverQueue.songs[0].title}`);
	} else if (command === 'duraklat') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle("**:pause_button: Müzik Senin İçin Durduruldu!**")
      .setColor('RANDOM'));
		}
		return msg.channel.send(':warning: | **Çalan Müzik Bulunmamakta**');
	} else if (command === 'devam') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle("**:arrow_forward: Müzik Senin İçin Devam Etmekte!**")
      .setColor('RANDOM'));
		}
		return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setTitle(":warning: ** | Çalan Müzik Bulunmamakta.**")
    .setColor('RANDOM'));
	}
  

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
        durations: video.duration.seconds,
    views: video.views,
    };
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`:warning: **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`);
			queue.delete(msg.guild.id);
			return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle(`:warning: **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`)
      .setColor('RANDOM'))
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setTitle(`:arrow_heading_up:  **${song.title}** Adlı Müzik Kuyruğa Eklendi!`)
    .setColor('RANDOM'))
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === ' :x:  | **Yayın Akış Hızı Yeterli Değil.**') console.log('Müzik Bitti.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	 serverQueue.textChannel.sendEmbed(new Discord.RichEmbed()                                   
  .setTitle("**DarkDayS | ?? Müzik Başladı**",`https://cdn.discordapp.com/avatars/473974675194511361/6bb90de9efe9fb80081b185266bb94a6.png?size=2048`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('\nBaşlık', `[${song.title}](${song.url})`, true)
  .addField("\nSes Seviyesi", `${serverQueue.volume}%`, true)
  .addField("Süre", `${song.durationm}:${song.durations}`, true)
  .setColor('RANDOM'));
}

//====================================================================================================================================
//M Ü Z İ K - S O N                    M Ü Z İ K - S O N                    M Ü Z İ K - S O N               M Ü Z İ K - S O N
//=====================================================================================================================================
//disko
    client.on('message', async msg => {
    if (msg.content.toLowerCase() === prefix + "disko") {
   if (msg.channel.type === "dm") return;
  const rol = 'Disko●' // Rol ismi buraya
  setInterval(() => {
      msg.guild.roles.find(s => s.name === rol).setColor("RANDOM")
      }, 350);
  }
});
 //disko
//Kod Mustafa Arda = CrazyNoob#2309 'a Aittir.  CODE ARE <3
//Kod Mustafa Arda = CrazyNoob#2309 'a Aittir.  CODE ARE <3


client.on("guildMemberAdd", async member => {
   const fs = require('fs');
    let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog.json", "utf8"));
    const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim)
    if (!gözelkanal) return;
     let username = member.user.username;
        if (gözelkanal === undefined || gözelkanal === null) return;
        if (gözelkanal.type === "text") {
            const bg = await Jimp.read("https://cdn.discordapp.com/attachments/450693709076365323/473184528148725780/guildAdd.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        }
    })
const Jimp = require('jimp');
client.on("guildMemberRemove", async member => {
   const fs = require('fs');
    let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog.json", "utf8"));
    const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim)
    if (!gözelkanal) return;
        let username = member.user.username;
        if (gözelkanal === undefined || gözelkanal === null) return;
        if (gözelkanal.type === "text") {            
                        const bg = await Jimp.read("https://cdn.discordapp.com/attachments/450693709076365323/473184546477572107/guildRemove.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        }
    })



//son
client.login(ayarlar.token);
