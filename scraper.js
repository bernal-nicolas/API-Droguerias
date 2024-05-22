const { chromium } = require('playwright');

async function scrapeCruzVerde(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.cruzverde.com.co/search?query=${encodeURIComponent(query)}`);
  await page.waitForTimeout(5000);

  const nombres = await page.$$eval('a.font-open.flex.items-center.text-main.text-16.sm\\:text-18.leading-20.font-semibold.ellipsis.hover\\:text-accent span.ng-star-inserted', spans => {
    return spans.slice(0, 5).map(span => span.innerText);
  });

  const imagenes = await page.$$eval('a[class*="ng-tns-c36-"].ng-star-inserted img', imgs => {
    const desiredClasses = ['ng-tns-c36-13', 'ng-tns-c36-14', 'ng-tns-c36-15', 'ng-tns-c36-16', 'ng-tns-c36-17'];
    const filteredImgs = imgs.filter(img => {
      const parentClass = img.closest('a').className;
      return desiredClasses.some(cls => parentClass.includes(cls));
    });
    return filteredImgs.map(img => img.src);
  });

  const precios = await page.$$eval('span.font-bold.text-prices', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });

  const enlaces = await page.$$eval('a.font-open.flex.items-center.text-main.text-16.sm\\:text-18.leading-20.font-semibold.ellipsis.hover\\:text-accent', links => {
    return links.slice(0, 5).map(link => "https://www.cruzverde.com.co" + link.getAttribute('href'));
  });

  await browser.close();

  const cruzVerde = {
    nombre_farmacia: "Cruz Verde",
    articulos: []
  };

  for (let i = 0; i < nombres.length; i++) {
    const producto = {
      nombre: nombres[i],
      precio: precios[i],
      imagen: imagenes[i],
      enlaces: enlaces[i]
    };
    cruzVerde.articulos.push(producto);
  }

  return cruzVerde;
}

async function scrapeLaRebaja(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.larebajavirtual.com/${encodeURIComponent(query)}`);
  await page.waitForTimeout(10000);

  const nombres = await page.$$eval('span.vtex-product-summary-2-x-productBrand', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim());
  });

  const imagenes = await page.$$eval('img.vtex-product-summary-2-x-imageNormal', imgs => {
    return imgs.slice(0, 5).map(img => img.getAttribute('src'));
  });

  const spams = await page.$$eval('span.vtex-product-price-1-x-currencyInteger--summary', spams => {
    return spams.map(spam => spam.textContent.trim());
  });

  var concatenaciones = [];

  for (var i = 0; i < spams.length - 1; i += 2) {

    var concatenacion = spams[i] + spams[i + 1];

    concatenaciones.push(concatenacion);
  }

  const precios = concatenaciones.slice(0, 5)

  const enlaces = await page.$$eval('a.vtex-product-summary-2-x-clearLink', enlaces => {
    return enlaces.slice(0, 5).map(enlace => "https://www.larebajavirtual.com" + enlace.getAttribute('href'));
  });

  await browser.close();

  const laRebaja = {
    nombre_farmacia: "La Rebaja",
    articulos: []
  };

  for (let i = 0; i < nombres.length; i++) {
    const producto = {
      nombre: nombres[i],
      precio: precios[i],
      imagen: imagenes[i],
      enlaces: enlaces[i]
    };
    laRebaja.articulos.push(producto);
  }

  return laRebaja;
}

async function scrapeFarmatodo(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.farmatodo.com.co/buscar?product=${encodeURIComponent(query)}`);
  await page.waitForTimeout(5000);

  const nombres = await page.$$eval('div.text-left.info p.text-title', elements => {
    return elements.slice(0, 5).map(element => element.textContent.trim());
  });

  const imagenes = await page.$$eval('picture.cont-img img.image.lozad', imgs => {
    return imgs.slice(0, 5).map(img => img.getAttribute('src'));
  });

  const precios = await page.$$eval('span.text-price', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });

  const enlaces = await page.$$eval('a.link', enlaces => {
    return enlaces.slice(0, 5).map(enlace => "https://www.farmatodo.com.co" + enlace.getAttribute('href'));
  });

  await browser.close();

  const farmatodo = {
    nombre_farmacia: "Farmatodo",
    articulos: []
  };

  for (let i = 0; i < nombres.length; i++) {
    const producto = {
      nombre: nombres[i],
      precio: precios[i],
      imagen: imagenes[i],
      enlaces: enlaces[i]
    };
    farmatodo.articulos.push(producto);
  }

  return farmatodo;
}

async function scrapeFarmaciaTorres(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.farmaciatorres.com/busqueda/${encodeURIComponent(query)}`);
  await page.waitForTimeout(5000);

  const nombres = await page.$$eval('span.titulo', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim());
  });

  const imagenes = await page.$$eval('div.image img', imgs => {
    return imgs.slice(0, 5).map(img => img.getAttribute('src'));
  });

  const precios = await page.$$eval('span.precio', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });

  const enlaces = await page.$$eval('div.product-item', divs => {
    return divs.slice(0, 5).map(div => "https://www.farmaciatorres.com/producto/" + div.getAttribute('data-id'));
  });

  await browser.close();

  const farmaciaTorres = {
    nombre_farmacia: "Farmacia Torres",
    articulos: []
  };

  for (let i = 0; i < nombres.length; i++) {
    const producto = {
      nombre: nombres[i],
      precio: precios[i],
      imagen: imagenes[i],
      enlaces: enlaces[i]
    };
    farmaciaTorres.articulos.push(producto);
  }

  return farmaciaTorres;
}

async function scrapeFarmaciasPasteur(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.farmaciaspasteur.com.co/${encodeURIComponent(query)}?_q=${encodeURIComponent(query)}&map=ft`);
  await page.waitForTimeout(9000);

  const nombres = await page.$$eval('span.vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim());
  });

  const imagenes = await page.$$eval('img.vtex-product-summary-2-x-imageInline.vtex-product-summary-2-x-image', imgs => {
    return imgs.slice(0, 5).map(img => img.src);
  });

  const precios = await page.$$eval('span.vtex-product-price-1-x-sellingPriceValue', spans => {
    return spans.slice(0, 5).map(span => {
      const precioLimpio = span.textContent.trim().replace(/[^\d]/g, '');
      return precioLimpio;
    });
  });

  const listaenlaces = await page.$$eval('section.vtex-product-summary-2-x-container a', anchors => {
    return anchors.map(anchor => anchor.href);
  });

  const enlaces = listaenlaces.slice(0, 5);

  await browser.close();

  const farmaciasPasteur = {
    nombre_farmacia: "Farmacias Pasteur",
    articulos: []
  };

  for (let i = 0; i < nombres.length; i++) {
    const producto = {
      nombre: nombres[i],
      precio: precios[i],
      imagen: imagenes[i],
      enlaces: enlaces[i]
    };
    farmaciasPasteur.articulos.push(producto);
  }

  return farmaciasPasteur;
}

async function scrapeData(query) {
  const [cruzVerde, laRebaja, farmatodo, farmaciaTorres, farmaciasPasteur] = await Promise.all([
    scrapeCruzVerde(query),
    scrapeLaRebaja(query),
    scrapeFarmatodo(query),
    scrapeFarmaciaTorres(query),
    scrapeFarmaciasPasteur(query)
  ]);

  const resultado = [cruzVerde, laRebaja, farmatodo, farmaciaTorres, farmaciasPasteur];

  // Modificar el objeto de respuesta de tal forma
  // que por cada farmacia solo se muestren los 3
  // productos más baratos.
  resultado.forEach(farmacia => {
    farmacia.articulos.sort((a, b) => a.precio - b.precio);
    farmacia.articulos = farmacia.articulos.slice(0, 3);
  });
  return resultado;
}

module.exports = scrapeData;