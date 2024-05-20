const { chromium } = require('playwright');

async function scrapeData(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  //Cruz Verde

  await page.goto(`https://www.cruzverde.com.co/search?query=${encodeURIComponent(query)}`);

  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: 'pagina1_screenshot.png', fullPage: true });

  const nombres = await page.$$eval('a.font-open.flex.items-center.text-main.text-16.sm\\:text-18.leading-20.font-semibold.ellipsis.hover\\:text-accent span.ng-star-inserted', spans => {
    return spans.slice(0, 3).map(span => span.innerText);
  });


  const imagenes = await page.$$eval('a[class*="ng-tns-c36-"].ng-star-inserted img', imgs => {
    const desiredClasses = ['ng-tns-c36-13', 'ng-tns-c36-14', 'ng-tns-c36-15'];
    const filteredImgs = imgs.filter(img => {
      const parentClass = img.closest('a').className;
      return desiredClasses.some(cls => parentClass.includes(cls));
    });
    return filteredImgs.map(img => img.src);
  });


  const precios = await page.$$eval('span.font-bold.text-prices', spans => {
    return spans.slice(0, 3).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });

  const enlaces = await page.$$eval('a.font-open.flex.items-center.text-main.text-16.sm\\:text-18.leading-20.font-semibold.ellipsis.hover\\:text-accent', links => {
    return links.slice(0, 3).map(link => "https://www.cruzverde.com.co" + link.getAttribute('href'));
  });

  //La Rebaja

  await page.goto(`https://www.larebajavirtual.com/${encodeURIComponent(query)}`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina2_screenshot.png', fullPage: true });

  const nombres2 = await page.$$eval('span.vtex-product-summary-2-x-productBrand', spans => {
    return spans.slice(0, 3).map(span => span.textContent.trim());
  });


  const imagenes2 = await page.$$eval('img.vtex-product-summary-2-x-imageNormal', imgs => {
    return imgs.slice(0, 3).map(img => img.getAttribute('src'));
  });

  const spams = await page.$$eval('span.vtex-product-price-1-x-currencyInteger--summary', spams => {
    return spams.map(spam => spam.textContent.trim());
  });

  var concatenaciones = [];

  for (var i = 0; i < spams.length - 1; i += 2) {

    var concatenacion = spams[i] + spams[i + 1];

    concatenaciones.push(concatenacion);
  }

  const precios2 = concatenaciones.slice(0, 3)


  const enlaces2 = await page.$$eval('a.vtex-product-summary-2-x-clearLink', enlaces => {
    return enlaces.slice(0, 3).map(enlace => "https://www.larebajavirtual.com" + enlace.getAttribute('href'));
  });

  // Farmatodo

  await page.goto(`https://www.farmatodo.com.co/buscar?product=${encodeURIComponent(query)}`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina3_screenshot.png', fullPage: true });

  const nombres3 = await page.$$eval('div.text-left.info p.text-title', elements => {
    return elements.slice(0, 3).map(element => element.textContent.trim());
  });

  const imagenes3 = await page.$$eval('picture.cont-img img.image.lozad', imgs => {
    return imgs.slice(0, 3).map(img => img.getAttribute('src'));
  });

  const precios3 = await page.$$eval('span.text-price', spans => {
    return spans.slice(0, 3).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });  

  const enlaces3 = await page.$$eval('a.link', enlaces => {
    return enlaces.slice(0, 3).map(enlace => "https://www.farmatodo.com.co" + enlace.getAttribute('href'));
  });

  // Se cierra el Cronium

  await browser.close();

  //Creacion JSON

  let drogueria1 = {
    nombre_drogueria: "Cruz Verde",
    articulos: []
  };

  let drogueria2 = {
    nombre_drogueria: "La Rebaja",
    articulos: []
  };

  let drogueria3 = {
    nombre_drogueria: "Farmatodo",
    articulos: []
  };


  for (let i = 0; i < nombres.length; i++) {
    let producto = {
      nombre: nombres[i],
      precio: precios[i],
      imagen: imagenes[i],
      enlaces: enlaces[i]
    };
    drogueria1.articulos.push(producto);
  }


  for (let i = 0; i < nombres2.length; i++) {
    let producto = {
      nombre: nombres2[i],
      precio: precios2[i],
      imagen: imagenes2[i],
      enlaces: enlaces2[i]
    };
    drogueria2.articulos.push(producto);
  }

  for (let i = 0; i < nombres3.length; i++) {
    let producto = {
      nombre: nombres3[i],
      precio: precios3[i],
      imagen: imagenes3[i],
      enlaces: enlaces3[i]
    };
    drogueria3.articulos.push(producto);
  }


  return [drogueria1, drogueria2, drogueria3];
}

module.exports = scrapeData;