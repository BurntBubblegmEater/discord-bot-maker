const { MessageEmbed, MessageAttachment, Client } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const fse = require('fs-extra');
const fs = require('fs');
var archiver = require('archiver');
module.exports = {
    name: "waitingroombot",
    category: "⚙️ Bot Creation",
    aliases: ["createwaitingroombot", "waitingroom", "createwaitingroom"],
    cooldown: 60*60,
    usage: "waitingroombot",
    description: "A Waitingroom Bot is perfect to setup for a **24/7 Radio** Channel or for an actual **Waitingroom**",
    commands: ["help", "ping", "uptime", "changeradio", "join", "leave", "play", "rejoin", "setup"],
    run: async (client, message, args, user, text, prefix) => {
    try{
      client.stats.inc(message.guild.id, "Bots")
      client.stats.inc("global", "Bots")
      client.stats.inc(message.guild.id, "commands")
      client.stats.inc("global", "commands")
      let approvalmsg = await message.author.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Do you have node.js 13.0.0 **__OR__** Higher?`)
        .setURL("https://nodejs.org/en/")
        .setDescription("If so, react with ✅ to continue! If you don't have it installed, then your Bot WILL NOT WORK!!\n*Also having [python](https://www.python.org/downloads/) and [ffmpeg](http://ffmpeg.org/download.html) is always very good!*")
      )
      approvalmsg.react("✅")
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setURL(approvalmsg.url)
        .setTitle(`Check your \`direct messages\` for the Creation!`)
      )
      await approvalmsg.awaitReactions((reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
    	.then(collected => console.log(`APPROVED: ${message.author.tag}`))
    	.catch(e => {
        console.log(String(e.stack).bgRed)
        return author.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | CANCELLED, you didnt reacted in time!`)
            .setDescription(`\`\`\`${e.message}\`\`\``)
        );
    	});

      let token, prefix,  owner = message.author.id, author = message.author;
      author.send(
        new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`Please enter a Bot Token!`)
          .setDescription(`You have 180 Seconds Time!\n\nGo to: https://discord.com/developers \n**-->** Create an Application\n**-->** Create a Bot under the \`BOT\` - Tab\n**-->** Copy the Token and send it to me!\n\n***You can set Avatar, and Name and invite it to your Guild Later!***`)
      ).then(msg => {
        msg.channel.awaitMessages(m=>m.author.id === author.id, { max: 1, time: 180000, errors: ['time'] })
        .then(async collected => {
            token = collected.first().content;
            if(token.length != "NzQ4MDg3OTA3NTE2MTUzODg5.X0YVJw.Wk6lEEwy158ZQ3wvKx3uvdnoWGA".length)
              return author.send(new MessageEmbed()
                .setFooter(ee.footertext,ee.footericon)
                .setColor(ee.wrongcolor)
                .setTitle("That's not a valid Token! please retry")
              )
            let workingtoken = await checktoken(token);
            if(!workingtoken)
              return author.send(new MessageEmbed()
                .setFooter(ee.footertext,ee.footericon)
                .setColor(ee.wrongcolor)
                .setTitle("That's not a valid Token! please retry")
                .setDescription(`Tho the Length is right, the Token isn't working! I TESTED IT!`)
              )
                author.send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`You have 180 Seconds Time!\n\nPlease enter a Bot PREFIX!`)
                    .setDescription(`You can always ping your Bot instead, but set a Default Prefix like: \`w!\`\n\n*A Prefix is the letter/thing which always stands infront of a Command!*`)
                ).then(msg=>{
                  msg.channel.awaitMessages(m=>m.author.id === author.id, { max: 1, time: 180000, errors: ['time'] })
                  .then(collected => {
                    prefix = collected.first().content;
                    let waitingroomconfig = require("../../bots/waitingroombot/botconfig/config.json")
                    let oldconfig = waitingroomconfig;
                    oldconfig.token = token;
                    oldconfig.prefix = prefix;
                    oldconfig.owner = owner;
                    fs.writeFile("./bots/waitingroombot/botconfig/config.json", JSON.stringify(oldconfig, null, 3), async (e) => {
                      if (e) {
                        console.log(String(e.stack).red);
                        return author.send(new MessageEmbed()
                          .setFooter(ee.footertext,ee.footericon)
                          .setColor(ee.wrongcolor)
                          .setTitle("❌ ERROR Writing the File")
                          .setDescription(`\`\`\`${e.message}\`\`\``)
                        )
                      }
                      let tempmsg = await author.send(new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Changed parameters...  |  Sending your Bot...`, "https://www.bluechipexterminating.com/wp-content/uploads/2020/02/loading-gif-png-5.gif")
                      )
                      const srcDir = `./bots/waitingroombot/`;
                      const destDir = './waitingroombot.zip'
                      var output = fs.createWriteStream(destDir);
                      var archive = archiver('zip');
                      output.on('close', function () {
                        setTimeout(()=>{
                          const attachment = new MessageAttachment(destDir);
                          author.send(attachment)
                          tempmsg.edit(new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`How to use the Bot?`)
                            .setDescription(`1. Download the ZIP file\n2. Extract the ZIP FILE into a FOLDER\n3. open a new TERMINAL(cmd/powershell) in this Directory!\n4. type: \`npm install\` to install all needed packages (discord.js @discordjs/opus ascii-table colors)\\n5. After that type \`node index.js\` and your Bot will start!\n\n\nNow invite your Bot to your Wished Server, and type \`${prefix}join\` Then your Bot will join your Channel and save it as the Waitingroom!\nYou can always resetup that with \`join\`  / \`setup\`\nYou can change the Radiostation by typing: \`${prefix}changeradio\`, but make sure that it's a valid mp3 Station Link!\n\nTo see all other available Commands type: \`${prefix}help\`\n*Note that this Bot only works in one guild at the time!*\n\nAlso you change the Embed Colors in \`/botconfig/embed.json\``)
                          )
                          setTimeout(()=>{
                            try {
                              fs.unlinkSync(destDir)
                            } catch(e) {
                            }
                            oldconfig = waitingroomconfig;
                            oldconfig.token = "";
                            oldconfig.prefix = "";
                            oldconfig.owner = "";
                            fs.writeFile("./bots/waitingroombot/botconfig/config.json", JSON.stringify(oldconfig, null, 3), async (e) => {
                              if (e) {
                                console.log("couldnt reset Waitingroombot")
                              }
                              console.log("resetted Waitingroombot")
                            })
                            return;
                          }, 1000)
                        }, 1000)
                      });
                      archive.on('error', function(e){
                        console.log(String(e.stack).red);
                        return author.send(new MessageEmbed()
                          .setFooter(ee.footertext,ee.footericon)
                          .setColor(ee.wrongcolor)
                          .setTitle("❌ ERROR Creating Zip")
                          .setDescription(`\`\`\`${e.message}\`\`\``)
                        )
                      });
                      archive.pipe(output);
                      // append files from a sub-directory, putting its contents at the root of archive
                      archive.directory(srcDir, false);
                      // append files from a sub-directory and naming it `new-subdir` within the archive
                      archive.directory('subdir/', 'new-subdir');
                      archive.finalize();
                    })
                  }).catch(e => {
                    console.log(String(e.stack).bgRed)
                    return author.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ ERROR | An error occurred`)
                        .setDescription(`\`\`\`${e.message}\`\`\``)
                    );
                  })
                }).catch(e => {
                  console.log(String(e.stack).bgRed)
                  return author.send(new MessageEmbed()
                      .setColor(ee.wrongcolor)
                      .setFooter(ee.footertext, ee.footericon)
                      .setTitle(`❌ ERROR | An error occurred`)
                      .setDescription(`\`\`\`${e.message}\`\`\``)
                  );
                })
              })
        .catch(e => {
              console.log(String(e.stack).bgRed)
              return author.send(new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter(ee.footertext, ee.footericon)
                  .setTitle(`❌ ERROR | An error occurred`)
                  .setDescription(`\`\`\`${e.message}\`\`\``)
              );
            })
      }).catch(e => {
                console.log(String(e.stack).bgRed)
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERROR | An error occurred`)
                    .setDescription(`\`\`\`${e.message}\`\`\`*Please enable your DMS*`)
                );
              })

    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``)
        );
    }
  }
}
async function checktoken(token){
  let testclient = new Client();
  try{
    await testclient.login(token)
    testclient.on("ready", () => testclient.destroy() )
    return true;
  } catch {
    console.log("INVALID TOKEN")
    return false;
  }
}
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
