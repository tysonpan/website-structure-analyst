'use strict';

const Controller = require('egg').Controller;

class GetUrlController extends Controller {
  async index() {
    const { ctx } = this;
    const url = ctx.query.url;

    // 解析url格式
    const urlLib = require("url");
    const urlObj = urlLib.parse(url);

    // 解析网页内容
    const cheerio = require('cheerio');
    const result = await ctx.curl(url);
    const $ = cheerio.load(result.data);
    
    let links = [];

    $('a').each(function(i,elem){
      const link = $(this).attr('href');
      if(!link) return;

      // 去掉不是超链接的和指向自己的
      if(link.indexOf('javascript') !== 0 && link !== urlObj.pathname){
        links.push({
          'link' : link,
          'text' : $(this).text().trim(),
        });
      }

    });
    
    ctx.body = {
      code:0,
      masg:'get url success',
      data:links,
      length:links.length
    };
  }
}

module.exports = GetUrlController;
