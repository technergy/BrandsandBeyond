const fs = require('fs');

const API_KEY = 'RXQAD87CKwN8yyjaYOPtPHQcFfscHUGmSxeSzRbeji9pABJgfO9O7D52';
const headers = { Authorization: API_KEY };

async function fetchPhotos(query, count) {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`, { headers });
  const data = await res.json();
  return data.photos;
}

async function run() {
  const portraits = await fetchPhotos('business portrait', 12);
  const conference = await fetchPhotos('conference crowd', 1);
  const stage = await fetchPhotos('conference stage', 1);
  const workshop = await fetchPhotos('workshop', 1);
  const concert = await fetchPhotos('concert', 1);
  
  const getSrc = (photo, w, h) => photo ? photo.src.original + `?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop` : '';
  const getPortraitSrc = (index) => portraits[index] ? portraits[index].src.portrait : '';
  
  let content = fs.readFileSync('./components/sections.tsx', 'utf8');
  
  // replace about_event
  if (conference[0]) content = content.replace(/https:\/\/picsum\.photos\/seed\/about_event\/1200\/800/g, getSrc(conference[0], 1200, 800));
  
  // replace speakers (spk1 to spk6)
  for (let i = 0; i < 6; i++) {
    content = content.replace(new RegExp(`https:\\/\\/picsum\\.photos\\/seed\\/spk${i+1}\\/500\\/500`, 'g'), getPortraitSrc(i));
  }
  
  // replace advisors (adv1 to adv6)
  for (let i = 0; i < 6; i++) {
    content = content.replace(new RegExp(`https:\\/\\/picsum\\.photos\\/seed\\/adv${i+1}\\/500\\/500`, 'g'), getPortraitSrc(i + 6));
  }
  
  // replace exp1, exp2, exp3
  if (stage[0]) content = content.replace(/https:\/\/picsum\.photos\/seed\/exp1\/1200\/800/g, getSrc(stage[0], 1200, 800));
  if (workshop[0]) content = content.replace(/https:\/\/picsum\.photos\/seed\/exp2\/1200\/800/g, getSrc(workshop[0], 1200, 800));
  if (concert[0]) content = content.replace(/https:\/\/picsum\.photos\/seed\/exp3\/1200\/800/g, getSrc(concert[0], 1200, 800));
  
  fs.writeFileSync('./components/sections.tsx', content);
  console.log('Done replacing images');
}

run();
