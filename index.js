const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const TOKEN = process.env.TOKEN;

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ترحيب بالأعضاء الجدد
client.on('guildMemberAdd', member => {
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`🎉 أهلًا وسهلًا ${member} نورت السيرفر! ✨`);
  }
});

// أمر القيف أواي
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!سحب')) return;
  if (!message.member.permissions.has('Administrator')) {
    return message.reply('🚫 ليس لديك صلاحية.');
  }

  const args = message.content.split(' ').slice(1);
  const duration = parseInt(args[0]);
  const prize = args.slice(1).join(' ');

  if (!duration || !prize) {
    return message.reply('❌ الاستعمال: !سحب [المدة بالثواني] [الجائزة]');
  }

  const giveawayMsg = await message.channel.send(
    `🎉 **قيف أواي!**\nالجائزة: **${prize}**\nالمدة: **${duration} ثانية**\nاضغط 🎉 للمشاركة!`
  );
  await giveawayMsg.react('🎉');

  setTimeout(async () => {
    const newMsg = await message.channel.messages.fetch(giveawayMsg.id);
    const reactions = newMsg.reactions.cache.get('🎉');
    const users = await reactions.users.fetch();
    const filtered = users.filter(u => !u.bot).map(u => u);

    if (filtered.length === 0) {
      return message.channel.send('😕 لم يشارك أحد.');
    }

    const winner = filtered[Math.floor(Math.random() * filtered.length)];
    message.channel.send(`🎊 مبروك ${winner} فزت بـ **${prize}**!`);
  }, duration * 1000);
});

client.login(MTM5MDA2NzU4NzUyMTQ0NTk2MA.G29Y1e.FOXZhBKpkTo1Bm8f6zgtkFnyW_Pvw3K6tcQees);
