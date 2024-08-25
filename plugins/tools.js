const { command, qrcode, Bitly, mode, isUrl, readQr } = require('../lib/')
const { getLyrics } = require('../lib/functions')

command(
 {
  pattern: 'qr',
  fromMe: mode,
  desc: 'Read/Write Qr.',
  type: 'tools',
 },
 async (message, match, m) => {
  match = match || message.reply_message.text

  if (match) {
   let buff = await qrcode(match)
   return await message.sendMessage(message.jid, buff, {}, 'image')
  } else if (message.reply_message.image) {
   const buffer = await m.quoted.download()
   readQr(buffer)
    .then(async data => {
     return await message.sendMessage(message.jid, data)
    })
    .catch(async error => {
     console.error('Error:', error.message)
     return await message.sendMessage(message.jid, error.message)
    })
  } else {
   return await message.sendMessage(message.jid, '*Example : qr test*\n*Reply to a qr image.*')
  }
 }
)

command(
 {
  pattern: 'bitly',
  fromMe: mode,
  desc: 'Converts Url to bitly',
  type: 'tools',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.reply('_Reply to a url or enter a url_')
  if (!isUrl(match)) return await message.reply('_Not a url_')
  let short = await Bitly(match)
  return await message.reply(short.link)
 }
)

command(
 {
  pattern: 'lyric',
  fromMe: mode,
  desc: 'Searches for lyrics based on the format: song;artist',
  type: 'tools',
 },
 async (message, match) => {
  const [song, artist] = match.split(';').map(item => item.trim())
  if (!song || !artist) {
   await message.reply('Search with this format: \n\t_lyric song;artist_')
  } else {
   try {
    const data = await getLyrics(song, artist)
    if (data) {
     return await message.reply(`*Artist:* ${data.artist_name}\n*Song:* ${data.song}\n*Lyrics:*\n${data.lyrics.trim()}`)
    } else {
     return await message.reply('No lyrics found for this song by this artist.')
    }
   } catch (error) {
    return await message.reply('An error occurred while fetching lyrics.')
   }
  }
 }
)
