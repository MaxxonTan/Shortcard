<div align=center>
  <img alt="Static Badge" src="https://github.com/MaxxonTan/Shortcard/assets/59834451/36f81d65-94b7-4190-913a-cf682e84ca7f">
</div>

<h2 align="center">Shortcard</h2>
<div align="center">
	
Shortcard is a web app built with <a href="https://nextjs.org/" target="_blank">**Next.js**</a>

Generate and share birthday/holiday cards with a link, with **no downloads** required. 

</div>
<p align="center">
  <a href="https://nextjs.org/">
    <img alt="Static Badge" src="https://img.shields.io/badge/Next.js-13.4.7-black?style=for-the-badge">
  <a href="https://github.com/fabricjs/fabric.js">
	<img alt="Static Badge" src="https://img.shields.io/badge/Fabric.js-5.3.0-pink?style=for-the-badge">
  </a>
  <a href="https://supabase.com/">
	<img alt="Static Badge" src="https://img.shields.io/badge/DB-Supabase-green?style=for-the-badge">
  </a>
</p>

# Features
- Sign in with **Google** (only) 🔐
- Display an optional **opening message** when someone opens your card. 💌 
- **Mobile-Friendly** pages for both viewing and editing the cards 📱
- Unique **link** generated for each card. 🔗
   
# Usage
**Once you have signed in with Google, you can create a card detailing who it's for and from:**

![CreatingCardf](https://github.com/MaxxonTan/Shortcard/assets/59834451/ca59c9cf-b03e-465d-bde3-745733d046d9)

**After editing your card, you can share a link to been seen by anybody:**

![image](https://github.com/MaxxonTan/Shortcard/assets/59834451/408ebe87-a92a-45d9-b3b3-11204a2e0104)

**That's it!** <a href="https://shortcard.vercel.app/cards/0cbba25c-3c75-4292-8ff1-4693aeec386a/view">Sample card</a>

![ViewCard](https://github.com/MaxxonTan/Shortcard/assets/59834451/634ebe12-5d9e-4167-ae6b-c2326fabe552)

# Tech stack and dependencies
- This project is built with the React framework [**Next.js 13.4.7** ](https://nextjs.org/) and it's app directory.
- For styling, this project is using [**Tailwind**](https://tailwindcss.com/) as the CSS framework.  
- For persistent storage, the app uses [**Supabase** ](https://supabase.com/) for its database, file storage and authentication.
- To create and view cards, the app uses the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API on top of [**Fabric.js**](http://fabricjs.com/), a JS canvas library that allows for manipulating canvas objects _(text, images, shapes, etc)_. This library also allows for converting canvas to JSON, which is what is saved in DB.
- The project uses [**Compressor.js**](https://fengyuanchen.github.io/compressorjs/) for compressing images before uploading them to Supabase, which have a 5mb file upload size limit.
- [**React Icons**](https://react-icons.github.io/react-icons) and [**React Spinners**](https://www.davidhu.io/react-spinners/) for icons and spinning.  

# Local Development
Before running this app, make sure you have [Node.js](https://nodejs.org/en) installed and have a `.env` file created in the root of the project (it's needed to connect to a database). When running locally, the app is configured to connect to the Supabase project configured in `.env.local`. Check out `.env.local.sample` to see what you need to configure. The public url and anon key can be found in your Supabase project's API settings.

To run the app, run the following commands:
```
npm install
npm run dev
```
# Additional Documentation
Check out [the wiki page](https://github.com/MaxxonTan/Shortcard/wiki)https://github.com/MaxxonTan/Shortcard/wiki!
