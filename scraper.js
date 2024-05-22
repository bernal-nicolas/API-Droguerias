const { chromium } = require('playwright');

async function scrapeData(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  //Cruz Verde

  await page.goto(`https://www.cruzverde.com.co/search?query=${encodeURIComponent(query)}`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina1_screenshot.png', fullPage: true });

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

  //La Rebaja

  await page.goto(`https://www.larebajavirtual.com/${encodeURIComponent(query)}`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina2_screenshot.png', fullPage: true });

  const nombres2 = await page.$$eval('span.vtex-product-summary-2-x-productBrand', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim());
  });


  const imagenes2 = await page.$$eval('img.vtex-product-summary-2-x-imageNormal', imgs => {
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

  const precios2 = concatenaciones.slice(0, 5)


  const enlaces2 = await page.$$eval('a.vtex-product-summary-2-x-clearLink', enlaces => {
    return enlaces.slice(0, 5).map(enlace => "https://www.larebajavirtual.com" + enlace.getAttribute('href'));
  });

  // Farmatodo

  await page.goto(`https://www.farmatodo.com.co/buscar?product=${encodeURIComponent(query)}`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina3_screenshot.png', fullPage: true });

  const nombres3 = await page.$$eval('div.text-left.info p.text-title', elements => {
    return elements.slice(0, 5).map(element => element.textContent.trim());
  });

  const imagenes3 = await page.$$eval('picture.cont-img img.image.lozad', imgs => {
    return imgs.slice(0, 5).map(img => img.getAttribute('src'));
  });

  const precios3 = await page.$$eval('span.text-price', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });

  const enlaces3 = await page.$$eval('a.link', enlaces => {
    return enlaces.slice(0, 5).map(enlace => "https://www.farmatodo.com.co" + enlace.getAttribute('href'));
  });

  // Farmacia Torres

  await page.goto(`https://www.farmaciatorres.com/busqueda/${encodeURIComponent(query)}`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina4_screenshot.png', fullPage: true });

  const nombres4 = await page.$$eval('span.titulo', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim());
  });

  const imagenes4 = await page.$$eval('div.image img', imgs => {
    return imgs.slice(0, 5).map(img => img.getAttribute('src'));
  });

  const precios4 = await page.$$eval('span.precio', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim().replace(/[^\d]/g, ''));
  });

  const enlaces4 = await page.$$eval('div.product-item', divs => {
    return divs.slice(0, 5).map(div => "https://www.farmaciatorres.com/producto/" + div.getAttribute('data-id'));
  });

  // Farmacias Pasteur

  await page.goto(`https://www.farmaciaspasteur.com.co/${encodeURIComponent(query)}?_q=${encodeURIComponent(query)}&map=ft`);

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'pagina5_screenshot.png', fullPage: true });

  const nombres5 = await page.$$eval('span.vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body', spans => {
    return spans.slice(0, 5).map(span => span.textContent.trim());
  });

  const imagenes5 = await page.$$eval('img.vtex-product-summary-2-x-imageInline.vtex-product-summary-2-x-image', imgs => {
    return imgs.slice(0, 5).map(img => img.src);
  });

  const precios5 = await page.$$eval('span.vtex-product-price-1-x-sellingPriceValue', spans => {
    return spans.slice(0, 5).map(span => {
      const precioLimpio = span.textContent.trim().replace(/[^\d]/g, '');
      return precioLimpio;
    });
  });

  const listaenlaces5 = await page.$$eval('section.vtex-product-summary-2-x-container a', anchors => {
    return anchors.map(anchor => anchor.href);
  });

  const enlaces5 = listaenlaces5.slice(0, 5);

  // Se cierra el Cronium

  await browser.close();

  //Creacion JSON y ordenamiento del menor a mayor

  function crearJSONConProductosMasBaratos(nombres, precios, imagenes, enlaces, nombres2, precios2, imagenes2, enlaces2, nombres3, precios3, imagenes3, enlaces3, nombres4, precios4, imagenes4, enlaces4, nombres5, precios5, imagenes5, enlaces5) {

    let farmacias = [
      { nombre_farmacia: "Cruz Verde", articulos: [] },
      { nombre_farmacia: "La Rebaja", articulos: [] },
      { nombre_farmacia: "Farmatodo", articulos: [] },
      { nombre_farmacia: "Farmacia Torres", articulos: [] },
      { nombre_farmacia: "Farmacias Pasteur", articulos: [] }
    ];

    function añadirProductos(farmacia, nombres, precios, imagenes, enlaces) {
      for (let i = 0; i < nombres.length; i++) {
        let producto = {
          nombre: nombres[i],
          precio: precios[i],
          imagen: imagenes[i],
          enlaces: enlaces[i]
        };
        farmacia.articulos.push(producto);
      }

      farmacia.articulos.sort((a, b) => a.precio - b.precio);

      farmacia.articulos = farmacia.articulos.slice(0, 3);
    }

    añadirProductos(farmacias[0], nombres, precios, imagenes, enlaces);
    añadirProductos(farmacias[1], nombres2, precios2, imagenes2, enlaces2);
    añadirProductos(farmacias[2], nombres3, precios3, imagenes3, enlaces3);
    añadirProductos(farmacias[3], nombres4, precios4, imagenes4, enlaces4);
    añadirProductos(farmacias[4], nombres5, precios5, imagenes5, enlaces5);

    return farmacias;
  }

  const resultado = crearJSONConProductosMasBaratos(nombres, precios, imagenes, enlaces, nombres2, precios2, imagenes2, enlaces2, nombres3, precios3, imagenes3, enlaces3, nombres4, precios4, imagenes4, enlaces4, nombres5, precios5, imagenes5, enlaces5);

  return resultado;
}

module.exports = scrapeData;