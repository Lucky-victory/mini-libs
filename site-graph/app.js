const {Hono}=require('hono')
const {serve}=require('@hono/node-server');
const puppeteer=require('puppeteer')

const app=new Hono();


async function scrapeSiteGraph(url='https://ahrefs.com/blog/open-graph-meta-tags'){
    const siteGraph={}
    try {
    const browser=await puppeteer.launch({headless:'new'});
    const page=await browser.newPage();
    await page.goto(url)
    const title= await page.title();
    siteGraph['title']=title
    try{
    
        const metaDescription=await page.$eval("meta[property='og:description']",(element)=>element.content)
        siteGraph['metaDescription']=metaDescription
        
    }
    catch(error){
        
    }
    try {
        const metaKeywords=await page.$eval("meta[name='keywords']",(element)=>element.content)
        siteGraph['metaKeywords']=metaKeywords
        
    } catch (error) {
        
    }
    try {
        const ogImage=await page.$eval("meta[property='og:image']",(element)=>element.content)
        siteGraph['ogImage']=ogImage
        
    } catch (error) {
        
    }
  
    await browser.close()
    } catch (error) {
        
    }
    
    return siteGraph
}

app.get('/',(c)=>{
    return c.text('Welcome to site graph')
})

app.get('/site-graph',async (c)=>{
    // const {url='https://google.com'}=await c.req.json()
    const url='https://facebook.com'
    try {
        
 const data= await scrapeSiteGraph(url)
 
return c.json({
    message:'Site information received',data:data
},200)
} catch (error) {
   return  c.json({
        message:'An error occured',data:null
     },500)   
}
})

app.post('/site-graph',async (c)=>{
    const {url='https://google.com'}=await c.req.json()
    try {
        
 const data= await scrapeSiteGraph(url)
 
return c.json({
    message:'Site information received',data:data
},200)
} catch (error) {
   return  c.json({
        message:'An error occured',data:null
     },500)   
}
})


serve(app)