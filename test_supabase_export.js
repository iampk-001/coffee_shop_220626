const fs = require('fs');
const { JSDOM } = require('jsdom');

const js = fs.readFileSync('supabase.js', 'utf8');

const dom = new JSDOM(`<body><script>${js}</script></body>`, { runScripts: "dangerously" });
const window = dom.window;

console.log("Type of window.supabase:", typeof window.supabase);
if (window.supabase) {
    console.log("Keys in window.supabase:", Object.keys(window.supabase));
    console.log("Has createClient?", typeof window.supabase.createClient === 'function');
}
